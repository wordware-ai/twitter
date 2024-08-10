/* tslint:disable */
/* eslint-disable */
import "sst"
declare module "sst" {
  export interface Resource {
    ApifySecret: {
      type: "sst.sst.Secret"
      value: string
    }
    NeonDbUrl: {
      type: "sst.sst.Secret"
      value: string
    }
    ProfileScrapingDeduplication: {
      type: "sst.aws.Queue"
      url: string
    }
    ScrapeProfile: {
      type: "sst.aws.Queue"
      url: string
    }
    ScrapingApi: {
      type: "sst.aws.ApiGatewayV2"
      url: string
    }
  }
}
export {}
