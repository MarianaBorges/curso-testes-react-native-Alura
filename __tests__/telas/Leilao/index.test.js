import React from 'react';
import { act, render, fireEvent, waitFor } from '@testing-library/react-native';
import { Text, TouchableWithoutFeedback } from 'react-native'

import Leilao from '../../../src/telas/Leilao';
import Topo from '../../../src/telas/Leilao/componentes/Topo';
import Lance from '../../../src/telas/Leilao/componentes/Lance';
import EnviaLance from '../../../src/telas/Leilao/componentes/EnviaLance';

import useLeilao from '../../../src/hooks/useLeilao';

const mockObtemLeilao = jest.fn();
const mockEnviaLance = jest.fn(() => ({ valido: true }));

jest.mock('../../../src/hooks/useLeilao', () => jest.fn(() => ([
    {
        id: 1, 
        nome: 'Leilão de teste',
        lances: [
            {
                id: 1,
                valor: 1200,
            },
            {
                id: 2,
                valor: 1300,
            },
        ]
    },
    mockObtemLeilao,
    mockEnviaLance
])));

jest.mock('../../../src/telas/Leilao/componentes/Topo');
jest.mock('../../../src/telas/Leilao/componentes/EnviaLance');
jest.mock('../../../src/telas/Leilao/componentes/Lance');

jest.mock('@react-navigation/native', () => ({
    useRoute: jest.fn().mockReturnValue({
        params:{
            id: 1,
        }
    }),
}));

describe('telas/Leilao', () => {
    const [leilao, obtemLeilao, enviaLance] = useLeilao();
    
    beforeAll(() => {
        Topo.mockImplementation(({nome}) => <Text>Topo: {nome}</Text>)
        Lance.mockImplementation(({valor}) => <Text>Lance: {valor}</Text>)
        EnviaLance.mockImplementation(({ enviaLance }) => <TouchableWithoutFeedback onPress={enviaLance}>
            <Text>Enviar Lance</Text>
        </TouchableWithoutFeedback>)
    });

    beforeEach(()=>{
        jest.clearAllMocks();
    });

    it('deve renderizar mostrando o componente de Leilao', () => {
        const { getByText } = render(<Leilao />);

        expect(getByText('Topo: Leilão de teste')).toBeTruthy();
        expect(getByText('Lance: 1200')).toBeTruthy();
        expect(getByText('Lance: 1300')).toBeTruthy();

        expect(obtemLeilao).not.toHaveBeenCalled();
        expect(enviaLance).not.toHaveBeenCalled();
    });

    it('deve atualizar o leilao quando a flatlist carregar', () => {
        const { getByTestId } = render(<Leilao />);

        const flatlist = getByTestId('list-lances');

        act(() => {
            flatlist.props.onRefresh();
        });

        expect(mockObtemLeilao).toHaveBeenCalledTimes(1);
        expect(mockEnviaLance).not.toHaveBeenCalled();
    });

    it('deve chamar enviaLance quando o lance for enviado e recarregar o leilão', async () => {
        const { getByText } = render(<Leilao />);
        
        fireEvent.press(getByText('Enviar Lance'));

        expect(mockEnviaLance).toHaveBeenCalledTimes(1);
        expect(mockObtemLeilao).not.toHaveBeenCalled();

        await waitFor(() => {
           expect(mockObtemLeilao).toHaveBeenCalledTimes(1);
        });
    });

    it('não deve crashar quando o leilão estiver carregando', async () => {
        useLeilao.mockImplementation(()=>([[]]));
        const { getByTestId } = render(<Leilao />);

        expect(() => getByTestId('list-lances')).toThrow();
    })
})