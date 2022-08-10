import React from "react";
import { useNavigation } from '@react-navigation/native';
import {fireEvent, render} from "@testing-library/react-native";

import Leilao from '../../../../src/telas/ListaLeiloes/componentes/Leilao';


jest.mock('@react-navigation/native', ()=>({
    useNavigation: jest.fn().mockReturnValue({
        navigate: jest.fn(),
    })
}));

jest.mock('../../../../src/negocio/formatadores/moeda.js',()=>({
    formataDecimalParaReal: jest.fn((valor)=> valor),
}))

describe('src/telas/ListaLeiloes/componentes/Leilao', ()=>{
    const navigation = useNavigation();

    const mockLeilao = {
        id: 1,
        nome: "TV",
        descricao: "TV de LED 50\"",
        valorInicial: 1000,
        icone: "tv",
        cor: "#ffba05"
    }

    beforeEach(()=>{
        navigation.navigate.mockClear();
    })
    it('deve exibir o nome do produto e valor inicial do leilão', () =>{
        
        const { getByText } = render(<Leilao {...mockLeilao} />);

        expect(getByText("TV")).toBeTruthy();
        expect(getByText("1000")).toBeTruthy();
    });

    it('deve chamar a função de navegação', async ()=>{

        const { getByTestId } = render(<Leilao {...mockLeilao} />);

        const card = getByTestId("card");
        
        fireEvent.press(card);

        expect(navigation.navigate).toHaveBeenCalledTimes(1);
        expect(navigation.navigate).toHaveBeenCalledWith('Leilao', { id: 1 })
    });
});