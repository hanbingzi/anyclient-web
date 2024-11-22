import { Autowired, Injectable } from '@opensumi/di';
import { IProductVersionDao, IProductVersionDaoPath, IProductVersionService, ProductVersion } from '../common';

@Injectable()
export class ProductVersionService implements IProductVersionService {

  @Autowired(IProductVersionDaoPath)
  private productVersionDao: IProductVersionDao;


  ignoreVersion(version: string): void {
    const pv: ProductVersion = { version, ignore: 1 };
    this.productVersionDao.save(pv);
  }
}
