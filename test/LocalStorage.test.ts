import 'mockzilla-webextension'
import { LocalStorage } from './../src/LocalStorage'

describe('LocalStorage', () => {
  describe('LocalStorage function test', () => {
    it('method all() should return all values saved in localStorage', async () => {
      const name = 'option-name'
      const value = 'option-value-in-storage'
      const valueInStorage = { [name]: value }

      mockBrowser.storage.local.get.expect(undefined).andResolve(valueInStorage).times(1)

      const sut = new LocalStorage()

      expect(await sut.all()).toEqual(valueInStorage)
    })
    it('method get() should return value by name', async () => {
      const name = 'option-name'
      const value = 'option-value-in-storage'
      const valueInStorage = { [name]: value }

      mockBrowser.storage.local.get.expect(name).andResolve(valueInStorage).times(1)

      const sut = new LocalStorage()

      expect(await sut.get(name)).toEqual(valueInStorage)
    })
    it('method set() should store value', async () => {
      const name = 'option-name'
      const value = 'option-value-in-storage'
      const valueInStorage = { [name]: value }

      mockBrowser.storage.local.set.expect(valueInStorage).andResolve().times(1)

      const sut = new LocalStorage()

      expect(await sut.set(valueInStorage))
    })
  })
})
