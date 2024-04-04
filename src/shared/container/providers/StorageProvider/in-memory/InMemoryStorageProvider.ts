import IStorageProvider from '../IStorageProvider';

export class InMemoryStorageProvider implements IStorageProvider {
  private storage: string[] = [];

  public async save(file: string): Promise<string> {
    this.storage.push(file);

    return file;
  }

  public async delete(file: string): Promise<void> {
    const findIndex = this.storage.findIndex(
      (storageFile) => storageFile === file
    );

    this.storage.splice(findIndex, 1);
  }
}
