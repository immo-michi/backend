import { ConfigModule } from '@nestjs/config'
import { Test, TestingModule } from '@nestjs/testing'
import { getRepositoryToken } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { PropertyEntity } from '../../entity/property/property.entity'
import { LoggerService } from '../../service/logger.service'
import { Immobilienscout24At } from './immobilienscout24.at'

describe('Immobilienscout24At', () => {
  let service: Immobilienscout24At;

  const repoToken = getRepositoryToken(PropertyEntity);

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        Immobilienscout24At,
        LoggerService,
        {
          provide: repoToken,
          useClass: Repository,
        },
      ],
      imports: [
        ConfigModule.forRoot()
      ]
    }).compile();

    service = module.get<Immobilienscout24At>(Immobilienscout24At);
  });

  it('listet alle bundesländer', () => {
    const urls = service.buildUrls()

    expect(urls.length).toEqual(9)
  })

  it('listet kaufbare wohnungen', async () => {
    const urls = service.buildUrls('wohnung-kaufen')
    const result = await service.list(urls[0])

    expect(result.getDataByURL.results.totalHits).toBeGreaterThan(0)
  })

  it('listet mietbare wohnungen', async () => {
    const urls = service.buildUrls('wohnung-mieten')
    const result = await service.list(urls[0])

    expect(result.getDataByURL.results.totalHits).toBeGreaterThan(0)

    console.log(result.getDataByURL.results.hits)
  })

  it('listet kaufbare häuser', async () => {
    const urls = service.buildUrls('haus-kaufen')
    const result = await service.list(urls[0])

    expect(result.getDataByURL.results.totalHits).toBeGreaterThan(0)
  })
})
