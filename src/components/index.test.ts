import * as Components from './index'

describe('components barrel file', () => {
    it('exports all components', () => {
        expect(Components.ServerInput).toBeDefined()
        expect(Components.ServerStatus).toBeDefined()
        expect(Components.QuickCommands).toBeDefined()
        expect(Components.FavoritesCommand).toBeDefined()
    })
})