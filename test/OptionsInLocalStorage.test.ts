import { StorageValue } from '../src/StorageValue'
import { OptionInLocalStorage } from '../src/OptionInLocalStorage'
import { OptionsInLocalStorage } from '../src/OptionsInLocalStorage'
import { It, Mock } from 'moq.ts'
import { ILocalStorage } from '../src/ILocalStorage'

describe('Options in LocalStorage', () => {
  const internalDefaultValue = ''
  const mockLocalStorage = new Mock<ILocalStorage>()

  describe('OptionsInLocalStorage function test', () => {
    it('0100: method option() should return option as instance of OptionInLocalStorage() and save it to localStorage using given name and default value - option was not saved yet', async () => {
      const name = 'option-name'
      const defaultValue = 'option-default-value'

      mockLocalStorage
        .setup((instance) => instance.get(It.Is((v) => v === name)))
        .returns(Promise.resolve({}))
      mockLocalStorage
        .setup((instance) =>
          instance.set(
            It.Is((v) => v === { [name]: new StorageValue(defaultValue, defaultValue) }),
          ),
        )
        .returns(Promise.resolve())

      const sut = new OptionsInLocalStorage(mockLocalStorage.object())

      expect(await sut.option(name, defaultValue)).toEqual(
        new OptionInLocalStorage(mockLocalStorage.object(), name, defaultValue),
      )
    })
    it('0200: method option() should return option as instance of OptionInLocalStorage() and save it to localStorage using given name and internal default value - option was not saved yet', async () => {
      const name = 'option-name'

      mockLocalStorage
        .setup((instance) => instance.get(It.Is((v) => v === name)))
        .returns(Promise.resolve({}))
      mockLocalStorage
        .setup((instance) =>
          instance.set(
            It.Is(
              (v) => v === { [name]: new StorageValue(internalDefaultValue, internalDefaultValue) },
            ),
          ),
        )
        .returns(Promise.resolve())

      const sut = new OptionsInLocalStorage(mockLocalStorage.object())

      const option = await sut.option(name, internalDefaultValue)
      expect(option).toEqual(
        new OptionInLocalStorage(mockLocalStorage.object(), name, internalDefaultValue),
      )
    })
    it('0300: method option() should return option as instance of OptionInLocalStorage() based on value saved in localStorage', async () => {
      const name = 'option-name'
      const value = 'option-value-in-storage'
      const storageDefaultValue = 'option-default-value-in-storage'

      mockLocalStorage
        .setup((instance) => instance.get(It.Is((v) => v === name)))
        .returns(
          Promise.resolve({
            [name]: new StorageValue(value, storageDefaultValue),
          }),
        )
      const sut = new OptionsInLocalStorage(mockLocalStorage.object())

      expect(await sut.option(name)).toEqual(
        new OptionInLocalStorage(mockLocalStorage.object(), name, storageDefaultValue),
      )
    })
    it('0400: method option() should return option as instance of OptionInLocalStorage() based on value saved in localStorage regardless of given default value', async () => {
      const name = 'option-name'
      const value = 'option-value-in-storage'
      const defaultValue = 'option-default-value'
      const storageDefaultValue = 'option-default-value-in-storage'

      mockLocalStorage
        .setup((instance) => instance.get(It.Is((v) => v === name)))
        .returns(
          Promise.resolve({
            [name]: new StorageValue(value, storageDefaultValue),
          }),
        )
      const sut = new OptionsInLocalStorage(mockLocalStorage.object())

      expect(await sut.option(name, defaultValue)).toEqual(
        new OptionInLocalStorage(mockLocalStorage.object(), name, storageDefaultValue),
      )
    })
    it('0500: method options() should return empty array when there are no options saved in localStorage', async () => {
      mockLocalStorage.setup((instance) => instance.all()).returns(Promise.resolve({}))

      const sut = new OptionsInLocalStorage(mockLocalStorage.object())

      expect(await sut.options()).toEqual([])
    })
    it('0600: method options() should return array containing the option as instance of OptionInLocalStorage() based on value saved in localStorage', async () => {
      const name = 'option-name'
      const value = 'option-value-in-storage'
      const storageDefaultValue = 'option-default-value-in-storage'

      mockLocalStorage
        .setup((instance) => instance.all())
        .returns(
          Promise.resolve({
            [name]: new StorageValue(value, storageDefaultValue),
          }),
        )

      const sut = new OptionsInLocalStorage(mockLocalStorage.object())

      expect(await sut.options()).toEqual([
        new OptionInLocalStorage(mockLocalStorage.object(), name, storageDefaultValue),
      ])
    })
    it('0700: method remove() should remove given option by name', async () => {
      const name = 'option-name'

      mockLocalStorage
        .setup((instance) => instance.remove(It.Is((v) => v === name)))
        .returns(Promise.resolve(undefined))

      const sut = new OptionsInLocalStorage(mockLocalStorage.object())

      expect(await sut.remove(name)).toBe(undefined)
    })
  })
})
