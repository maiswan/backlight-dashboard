import { renderHook, act } from '@testing-library/react'
import useHttpEndpoint from './useHttpEndpoint'
import toast from 'react-hot-toast'
import { vi } from 'vitest'
import { NIL } from 'uuid';
import type { Instruction } from '../instructions/instructionSchema';

vi.mock('react-hot-toast', () => ({
    default: {
        success: vi.fn(),
        error: vi.fn(),
    },
    success: vi.fn(),
    error: vi.fn(),
}));

const mockInstructions: Instruction[] = [{
    id: NIL,
    identifier: 'kelvin',
    z_index: 0,
    is_enabled: true,
    targets: null,
    kelvin: 2500,
}];

describe('useHttpEndpoint', () => {
    const server = 'http://localhost:1234'

    beforeEach(() => {
        vi.resetAllMocks();
    });

    it('shows success toast on 200 OK', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: true,
            status: 200,
            json: vi.fn(),
        }));

        const { result } = renderHook(() => useHttpEndpoint(server))
        await act(async () => {
            await result.current.putInstructions(mockInstructions);
        });

        expect(toast.success).toHaveBeenCalledWith('Instructions applied');
    });

    it('shows error toasts for 422 errors', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: false,
            status: 422,
            json: vi.fn().mockResolvedValue({
                detail: [
                    { input: 'bar', loc: ['body', 'foo'], msg: 'Invalid value' }
                ]
            }),
        }));

        const { result } = renderHook(() => useHttpEndpoint(server));
        await act(async () => {
            await result.current.putInstructions(mockInstructions);
        });

        expect(toast.error).toHaveBeenCalledWith(expect.stringContaining('foo: Invalid value'));
    });

    it('shows network error toast on fetch failure', async () => {
        vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Network error')));

        const { result } = renderHook(() => useHttpEndpoint(server));
        await act(async () => {
            await result.current.putInstructions(mockInstructions);
        });

        expect(toast.error).toHaveBeenCalledWith('Network error');
    });

    it('shows unknown error toast on non-422 errors', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
            ok: false,
            status: 403,
            json: vi.fn().mockResolvedValue({
                detail: [
                    { input: 'bar', loc: ['body', 'foo'], msg: 'Forbidden' }
                ]
            }),
        }));

        const { result } = renderHook(() => useHttpEndpoint(server));
        await act(async () => {
            await result.current.putInstructions(mockInstructions);
        });

        expect(toast.error).toHaveBeenCalledWith('Unknown error');
    });
});