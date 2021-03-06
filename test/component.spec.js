import { render } from './enzyme';
import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-dom/test-utils';
import {
    SDK,
    RegisteredComponent,
    ComponentToRegister,
} from './components';

test('useHookComponent() - component not registered', async () => {
    const notRegistered = document.createElement('div');
    ReactDOM.render(
        <>
            <RegisteredComponent />
        </>,
        notRegistered,
    );
    expect(notRegistered.innerHTML).toEqual('DefaultComponent');
    ReactDOM.unmountComponentAtNode(notRegistered);
});

test('useHookComponent() - component registered', async () => {
    const registered = document.createElement('div');
    const uuid = await SDK.Component.register(
        'registered-component',
        ComponentToRegister,
    );
    await ReactTestUtils.act(async () => {
        ReactDOM.render(
            <>
                <RegisteredComponent />
            </>,
            registered,
        );
    });

    expect(registered.innerHTML).toEqual('RegisteredComponent');
    ReactDOM.unmountComponentAtNode(registered);
    await SDK.Hook.unregister(uuid);
});
