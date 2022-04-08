import { FC, useEffect } from 'react';
import toast from 'react-hot-toast';
import { usePriorityAccount, usePriorityChainId } from '../connectors/priority';
import { useProvider } from '../hooks/useProvider';
import { useBlockchainStore } from '../stores/blockchain';
import { useTransactionsStore } from '../stores/transaction';
import { DEFAULT_TOAST_STYLES } from '../constants/styles';
export const TransactionsEffect: FC = () => {
  const blockNumber = useBlockchainStore((s) => s.blockNumber);
  const account = usePriorityAccount();
  const provider = useProvider(true);
  const chainId = usePriorityChainId();
  const { transactionMap, updateTransactionMap } = useTransactionsStore();

  useEffect(() => {
    if (!account || !chainId || !blockNumber || !provider) {
      return;
    }
    // TODO: worth changing to an await transation model
    for (const transaction of Object.values(transactionMap)) {
      if (transaction.status === 'in-progress') {
        provider
          .getTransactionReceipt(transaction.hash)
          .then((receipt) => {
            if (receipt) {
              updateTransactionMap((draft) => {
                draft[transaction.hash].lastBlockNumChecked = blockNumber;
                draft[transaction.hash].receipt = receipt;
                draft[transaction.hash].status =
                  receipt.status === 1 ? 'success' : 'failed';
              });
              if (receipt.status === 1) {
                toast.success('Txn success.', {
                  duration: 10000,
                  style: DEFAULT_TOAST_STYLES,
                  id: transaction.hash,
                });
              } else {
                toast.success('Txn failed.', {
                  duration: 10000,
                  style: DEFAULT_TOAST_STYLES,
                });
              }
            } else {
              updateTransactionMap((draft) => {
                draft[transaction.hash].lastBlockNumChecked = blockNumber;
              });
            }
          })
          .catch((error) => {
            console.error(
              `failed to check transaction hash: ${transaction.hash}`,
              error,
            );
          });
      }
    }
  }, [provider, blockNumber, account, chainId]);

  return <></>;
};
