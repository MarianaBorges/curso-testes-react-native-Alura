import { act, render } from "@testing-library/react-native";
import React from "react";
import { Text } from "react-native";

import useListaLeiloes from "../../../src/hooks/useListaLeiloes";

import ListaLeiloes from "../../../src/telas/ListaLeiloes";
import Leilao from "../../../src/telas/ListaLeiloes/componentes/Leilao";

const mockObtemLeiloes = jest.fn();

jest.mock('../../../src/hooks/useListaLeiloes', () => jest.fn(()=>([
    [
        {
            id: 1,
            nome: 'Leilão de teste'
        },
        { 
            id: 2,
            nome: 'Leilão teste 2'
        }
    ],
    mockObtemLeiloes
])));

jest.mock('../../../src/telas/ListaLeiloes/componentes/Leilao');

describe('telas/ListaLeiloes', ()=>{
    const [leiloes, obtemLeiloes] = useListaLeiloes();

    beforeEach(()=>{
        mockObtemLeiloes.mockClear();
    });

    it("deve atualizar a lista quando a flatlist recarregar", () =>{
        Leilao.mockImplementation(({nome}) => <Text>Teste: {nome}</Text>);

        const { getByText } = render(
            <ListaLeiloes />
        );

        expect(getByText('Teste: Leilão de teste')).toBeTruthy();
        expect(getByText('Teste: Leilão teste 2')).toBeTruthy();
        expect(obtemLeiloes).not.toHaveBeenCalled();
    });

    it("deve atualizar a lista quando a flatlist recarregar", () => {
        Leilao.mockImplementation(({nome}) => <Text>{nome}</Text>);

        const { getByTestId } = render(<ListaLeiloes />)
        
        const flatlist = getByTestId('lista-leiloes');

        act(() => {
            flatlist.props.onRefresh();
        });

        expect(mockObtemLeiloes).toHaveBeenCalledTimes(1);
    })
})