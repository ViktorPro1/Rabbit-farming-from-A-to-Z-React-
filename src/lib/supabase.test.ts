import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'

const createClientMock = vi.fn(() => ({ mocked: true }))

vi.mock('@supabase/supabase-js', () => ({
    createClient: createClientMock,
}))

describe('supabase client', () => {
    const originalUrl = import.meta.env.VITE_SUPABASE_URL
    const originalKey = import.meta.env.VITE_SUPABASE_ANON_KEY

    beforeEach(() => {
        vi.resetModules()
        createClientMock.mockClear()
    })

    afterEach(() => {
        import.meta.env.VITE_SUPABASE_URL = originalUrl
        import.meta.env.VITE_SUPABASE_ANON_KEY = originalKey
    })

    it('створює клієнт supabase з правильними url і key, коли змінні оточення задані', async () => {
        import.meta.env.VITE_SUPABASE_URL = 'https://test.supabase.co'
        import.meta.env.VITE_SUPABASE_ANON_KEY = 'test-anon-key'

        const { supabase } = await import('./supabase')

        expect(createClientMock).toHaveBeenCalledWith(
            'https://test.supabase.co',
            'test-anon-key'
        )
        expect(supabase).toEqual({ mocked: true })
    })

    it('кидає помилку, якщо VITE_SUPABASE_URL відсутній', async () => {
        import.meta.env.VITE_SUPABASE_URL = ''
        import.meta.env.VITE_SUPABASE_ANON_KEY = 'test-anon-key'

        await expect(import('./supabase')).rejects.toThrow(
            /Відсутні змінні оточення/
        )
    })

    it('кидає помилку, якщо VITE_SUPABASE_ANON_KEY відсутній', async () => {
        import.meta.env.VITE_SUPABASE_URL = 'https://test.supabase.co'
        import.meta.env.VITE_SUPABASE_ANON_KEY = ''

        await expect(import('./supabase')).rejects.toThrow(
            /Відсутні змінні оточення/
        )
    })
})