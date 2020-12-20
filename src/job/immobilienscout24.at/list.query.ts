import gql from 'graphql-tag'

export const LIST_QUERY = gql`
  query getDataByURL($params: ResultURLInput) {
    getDataByURL(params: $params) {
      exactMatch
      URL
      results {
        totalHits
        pagination {
          all
          pageIndex
          currentURL
          nextURL
          previousURL
          totalPages
        }
        hits {
          displayType
          addressString
          badges {
            label
            value
          }
          exposeId
          hasRealtorLogo
          headline
          links {
            targetURL
          }
          mainKeyFacts {
            value
            label
          }
          priceKeyFacts {
            value
            label
          }
          realtorLogoImageProps {
            src
          }

          ... on RegularListing {
            isPrivate
            primaryPictureImageProps {
              src
            }
          }
          ... on SmartPremiumListing {
            realtorContact {
              company
              name
              contactImageProps {
                src
              }
            }
            picturesImageProps {
              src
            }
          }
        }
      }
    }
  }
`

export interface Hit {
  displayType: string
  addressString: string
  badges: {
    label: string
    value: string
  }[]
  exposeId: string
  hasRealtorLogo: boolean
  headline: string
  links: {
    targetURL: string
  }
  mainKeyFacts: {
    value: string
    label: string
  }[]
  priceKeyFacts: {
    value: string
    label?: string
  }[]
  realtorLogoImageProps: {
    src: string
  }

  isPrivate?: boolean
  primaryPictureImageProps?: {
    src: string
  }

  realtorContact?: {
    company: string
    name: string
    contactImageProps: {
      src: string
    }
  }

  picturesImageProps?: {
    src: string
  }[]
}

export interface GetDataByURL {
  getDataByURL: {
    exactMatch: boolean
    URL: string
    results: {
      totalHits: number
      pagination: {
        all: string[]
        pageIndex: number
        currentURL: string
        nextURL?: string
        previousURL?: string
        totalPages: number
      }
      hits: Hit[]
    }
  }
}
