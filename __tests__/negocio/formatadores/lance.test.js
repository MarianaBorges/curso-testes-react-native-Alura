import {formataMaiorLanceDoLeilao} from "../../../src/negocio/formatadores/lance";

describe('negocio/formatadores/lance',()=>{
    const lance = [
        {
          "id": 5,
          "leilaoId": 3,
          "valor": 802,
        },
        {
          "id": 4,
          "leilaoId": 3,
          "valor": 800.02,
        },
        {
          "id": 3,
          "leilaoId": 3,
          "valor": 800.01,
        },
      ];
    describe("formataMaiorLanceDoLeilão", ()=>{
        it ("Deve retornar algo", ()=>{
            const result = formataMaiorLanceDoLeilao(lance, 800);
            //Verificar como essa funcão funciona
            expect(result).toBeCloseTo(802);
        })
    }) 
})