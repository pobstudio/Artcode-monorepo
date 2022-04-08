import React from 'react';
import App from 'next/app';
import { ThemedGlobalStyle } from '../theme';
import { BlockchainEffect } from '../effects/BlockchainEffect';
import { PROD_LINK, GLOBAL_OG_BANNER } from '../constants';
import { EagerConnectEffect } from '../effects/EagerConnectEffect';
import { TokensEffect } from '../effects/TokensEffect';
import { TransactionsEffect } from '../effects/TransactionsEffect';
import { DefaultSeo } from 'next-seo';
import { ApolloProvider } from '@apollo/client';
import { AppProvider } from '../contexts/app';
import { subgraphClient } from '../clients/subgraph';

const DEFAULT_TITLE = `TODO By POB - TODO`;
const DEFAULT_DESCRIPTION = ``;

export default class PobApp extends App {
  render() {
    const { Component, pageProps } = this.props;

    const { err } = this.props as any;
    const modifiedPageProps = { ...pageProps, err };
    return (
      <>
        <DefaultSeo
          title={DEFAULT_TITLE}
          description={DEFAULT_DESCRIPTION}
          openGraph={{
            type: 'website',
            locale: 'en_US',
            url: PROD_LINK,
            title: DEFAULT_TITLE,
            description: DEFAULT_DESCRIPTION,
            site_name: 'TODO',
            images: [
              {
                url: GLOBAL_OG_BANNER,
                // width: 800,
                // height: 418,
              },
            ],
          }}
          twitter={{
            handle: '@prrfbeauty',
            site: '@prrfbeauty',
            cardType: 'summary_large_image',
          }}
          additionalMetaTags={[
            {
              name: 'twitter:image',
              content: GLOBAL_OG_BANNER,
            },
            {
              name: 'twitter:url',
              content: PROD_LINK,
            },
          ]}
        />
        <ThemedGlobalStyle />
        <AppProvider>
          <ApolloProvider client={subgraphClient}>
            {/** Effects are any tasks that strictly only makes state changes to stores */}
            <BlockchainEffect />
            <EagerConnectEffect />
            <TokensEffect />
            <TransactionsEffect />
            {/** Modals */}
            {/** Fixed Components */}
            {/** Component */}
            <Component {...modifiedPageProps} />
          </ApolloProvider>
        </AppProvider>
      </>
    );
  }
}
