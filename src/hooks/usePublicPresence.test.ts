import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook } from '@testing-library/react'
import { usePublicPresence } from './usePublicPresence'
import { supabase } from '../lib/supabase'
import { logError } from '../lib/logError'

vi.mock('../lib/supabase', () => ({
    supabase: {
        channel: vi.fn(),
        removeChannel: vi.fn(),
    },
}))

vi.mock('../lib/logError', () => ({ logError: vi.fn() }))

type MockChannel = ReturnType<typeof supabase.channel>

function createMockChannel(status: 'SUBSCRIBED' | null = 'SUBSCRIBED'): MockChannel {
    const channel = {
        on: vi.fn().mockReturnThis(),
        subscribe: vi.fn((callback: (status: string) => void) => {
            if (status) callback(status)
            return channel
        }),
        track: vi.fn().mockResolvedValue({ status: 'ok' }),
    }
    return channel as unknown as MockChannel
}

describe('usePublicPresence', () => {
    beforeEach(() => {
        sessionStorage.clear()
        vi.clearAllMocks()
    })

    afterEach(() => {
        window.history.pushState({}, '', '/')
    })

    it('не створює канал presence на сторінках /admin', () => {
        window.history.pushState({}, '', '/admin/dashboard')

        renderHook(() => usePublicPresence())

        expect(supabase.channel).not.toHaveBeenCalled()
    })

    it('створює канал з session id та підписується на публічних сторінках', () => {
        window.history.pushState({}, '', '/breeds')
        const mockChannel = createMockChannel('SUBSCRIBED')
        vi.mocked(supabase.channel).mockReturnValue(mockChannel)

        renderHook(() => usePublicPresence())

        expect(supabase.channel).toHaveBeenCalledWith(
            'public-site-presence',
            expect.objectContaining({
                config: { presence: { key: expect.any(String) } },
            })
        )
        expect(mockChannel.on).toHaveBeenCalledWith(
            'presence',
            { event: 'sync' },
            expect.any(Function)
        )
        expect(mockChannel.track).toHaveBeenCalledWith(
            expect.objectContaining({
                page: '/breeds',
                session_id: expect.any(String),
            })
        )
    })

    it('зберігає session id в sessionStorage і перевикористовує його', () => {
        window.history.pushState({}, '', '/breeds')
        const mockChannel = createMockChannel('SUBSCRIBED')
        vi.mocked(supabase.channel).mockReturnValue(mockChannel)

        renderHook(() => usePublicPresence())

        const storedId = sessionStorage.getItem('presence_id')
        expect(storedId).toBeTruthy()

        renderHook(() => usePublicPresence())
        expect(sessionStorage.getItem('presence_id')).toBe(storedId)
    })

    it('викликає removeChannel при розмонтуванні', () => {
        window.history.pushState({}, '', '/breeds')
        const mockChannel = createMockChannel('SUBSCRIBED')
        vi.mocked(supabase.channel).mockReturnValue(mockChannel)

        const { unmount } = renderHook(() => usePublicPresence())
        unmount()

        expect(supabase.removeChannel).toHaveBeenCalledWith(mockChannel)
    })

    it('логує помилку, якщо track() відхиляється', async () => {
        window.history.pushState({}, '', '/breeds')
        const trackError = new Error('Network error')
        const mockChannel = createMockChannel('SUBSCRIBED')
        mockChannel.track = vi.fn().mockRejectedValue(trackError)
        vi.mocked(supabase.channel).mockReturnValue(mockChannel)

        renderHook(() => usePublicPresence())

        await vi.waitFor(() => {
            expect(logError).toHaveBeenCalledWith('usePublicPresence.track', trackError)
        })
    })
})