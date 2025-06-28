import { render, screen } from '@testing-library/react'
import FavoritesCommands from './index'
import { TestContextWrapper } from '../contextTestHelper';
import userEvent from '@testing-library/user-event';

describe('FavoritesCommands', async () => {

    const getAddRgbCommandButton = () => screen.getByTestId("addRgbQuickCommand");
    const buttonCountOffset = 2; // TestContextWrapper injects two buttons

    it('renders no favorite command buttons when quickCommands is empty', () => {
        render(<TestContextWrapper children={<FavoritesCommands/>}/>);
        
        const buttons = screen.queryAllByRole('button')
        expect(buttons.length).toBe(0 + buttonCountOffset);
    });

    it('renders a favorite command button', async () => {
        render(<TestContextWrapper children={<FavoritesCommands/>}/>);

        const add = getAddRgbCommandButton();
        await userEvent.click(add);

        const actual_apply_button = screen.getByRole('button', { name: /color_static_rgb\( red=255, green=127, blue=1 \)/ })
        const actual_remove_button = screen.getByRole('button', { name: /X/ })
        
        expect(actual_apply_button).toBeInTheDocument();
        expect(actual_remove_button).toBeInTheDocument();
    });

    it('removes the instruction if the X button is pressed', async () => {
        render(<TestContextWrapper children={<FavoritesCommands/>}/>);

        const add = getAddRgbCommandButton();
        await userEvent.click(add);
        
        const remove = screen.getByRole('button', { name: "X" });
        await userEvent.click(remove);
        
        const buttons = screen.queryAllByRole('button')
        expect(buttons.length).toBe(0 + buttonCountOffset);
    });

    it('Adds an instruction when the said instruction button is pressed', async () => {
        render(<TestContextWrapper children={<FavoritesCommands/>}/>);
        
        const add = getAddRgbCommandButton();
        await userEvent.click(add);

        const apply = screen.getByRole('button', { name: /color_static_rgb\( red=255, green=127, blue=1 \)/ })
        await userEvent.click(apply);

        const actual = JSON.parse(screen.getByTestId("instructions").textContent ?? "");
        expect(actual).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.stringMatching(/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i),
                    identifier: "color_static_rgb",
                    red: 255,
                    green: 127,
                    blue: 1,
                    targets: null,
                    is_enabled: true,
                    z_index: 0,
                })
            ])
        );
    });
});