import 'mockzilla-webextension'
// import of mockzilla-webextension before(!) actual import of 'webextension-polyfill' in system-under-test
import { mockEvent, MockzillaEventOf } from 'mockzilla-webextension'
import { deepMock } from 'mockzilla'
import { Runtime } from 'webextension-polyfill'
import { GithubMockzillaMessaging } from './../src/GithubMockzillaMessaging'

describe('BackgroundScriptMessaging', () => {
  const [port, mockPort, mockPortNode] = deepMock<Runtime.Port>('port')
  let msgs = new Array()
  let addListenerOnConnect: MockzillaEventOf<typeof mockBrowser.runtime.onConnect>
  let addListenerOnMessage: MockzillaEventOf<typeof mockPort.onMessage>

  beforeEach(() => {
    addListenerOnConnect = mockEvent(mockBrowser.runtime.onConnect)
    addListenerOnMessage = mockEvent(mockPort.onMessage)
    mockPortNode.enable()
  })

  afterEach(() => mockPortNode.verifyAndDisable())

  describe('MessagingBackgroundScript function test', () => {
    it('method connect() shall handle connection request', async () => {
      mockPort.postMessage.expect('test-message: reply')
      const sut = new GithubMockzillaMessaging()
      sut.connect()
      addListenerOnConnect.emit(port)
      addListenerOnMessage.emit('test-message', port)
    })
  })
  describe('MessagingBackgroundScript function test 2', () => {
    it('method connect() shall handle more connection requests', async () => {
      mockPort.postMessage.expect('test-message-2: reply')
      const sut = new GithubMockzillaMessaging()
      sut.connect()
      addListenerOnConnect.emit(port)
      addListenerOnMessage.emit('test-message-2', port)
    })
  })
})
