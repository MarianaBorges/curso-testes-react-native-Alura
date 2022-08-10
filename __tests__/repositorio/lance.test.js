import { obtemLancesDoLeilao, adicionaLance } from "../../src/repositorio/lance";
import apiLeiloes from '../../src/servicos/apiLeiloes';

jest.mock('../../src/servicos/apiLeiloes');

const mockLances = [
    {
        "id": 5,
        "leilaoId": 3,
        "valor": 802,
    }
]

const mockRequisicao = (retorno) => {
    return new Promise ((resolve) =>{
        setTimeout(() => {
            resolve({
                data: retorno
            })
        }, 200);
    });
}

const mockRequisicaoErro = (retorno) => {
    return new Promise ((_, reject) =>{
        setTimeout(() => {
            reject()
        }, 200);
    });
}

const mockNovoLance = (retorno) => {
    return new Promise ((resolve) =>{
        setTimeout(() => {
            resolve({
                data: true
            })
        }, 200);
    });
}

describe("repositorio/lance", ()=>{
    beforeEach(()=>{
        apiLeiloes.get.mockClear();
    })

    describe("obtemLancesDoLeilao", ()=>{
        it("deve retornar uma lista com os lances de um leilão", async ()=>{
            const id = 1;
            apiLeiloes.get.mockImplementation(() => mockRequisicao(mockLances));
            const lances = await obtemLancesDoLeilao(id);
            
            expect(lances).toEqual(mockLances);

            expect(apiLeiloes.get).toHaveBeenCalledWith(`/lances?leilaoId=${id}&_sort=valor&_order=desc`);
            expect(apiLeiloes.get).toHaveBeenCalledTimes(1);
        });
 
        it('deve retornar uma lista vazia quando a requisição falhar', async () =>{
            const id = 1;
            apiLeiloes.get.mockImplementation(() => mockRequisicaoErro());
            const lances = await obtemLancesDoLeilao(id);

            expect(lances).toEqual([]);

            expect(apiLeiloes.get).toHaveBeenCalledWith(`/lances?leilaoId=${id}&_sort=valor&_order=desc`);
            expect(apiLeiloes.get).toHaveBeenCalledTimes(1);
        });
    });

    describe("adicionaLance", ()=>{
        it("adicionar um lance", async ()=>{
            const novoLance = {
                "valor": 1000,
                "leilaoId": 1,
                "id": 1
            };
            apiLeiloes.post.mockImplementation(() => mockNovoLance(novoLance));
            const lance = await adicionaLance(novoLance);

            expect(lance).toBe(true);

        })

        it("Deve retornar false quando a requisição der errado", async () => {
            const novoLance = {
                "valor": 1000,
                "leilaoId": 1,
                "id": 1
            };
            apiLeiloes.post.mockImplementation(() => mockRequisicaoErro(novoLance));
            const lance = await adicionaLance(novoLance);

            expect(lance).toBe(false);
        });
    })
})

