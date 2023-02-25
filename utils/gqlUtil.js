import { gql } from "graphql-request";
export const saleStartedQuery  = gql`
    query Query($where: SaleStarted_filter) {
      saleStarteds(first:100, where: $where) {
        itemId
        tokenId
        nftContract
        metaDataURI
        seller
        blockTimestamp
        price
      }
    }
  `;
