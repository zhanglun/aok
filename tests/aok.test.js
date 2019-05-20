const Aok = require('../index')
const server = new Aok()
 
afterEach(() => {
  jest.resetModules()
})


describe('Check server', () => {
	test('server can start', () => {
		expect(server.start())
	})

	afterEach(() => {
	  server.close();
	});
})

describe('Check Class Aok Members', () => {
	test('Aok has Config', () => {
		expect(Aok.Config).toBeDefined()
	})

	test('Aok has Router', () => {
		expect(Aok.Router).toBeDefined()
	})

	test('Aok has Logger', () => {
		expect(Aok.Logger).toBeDefined()
	})
})



