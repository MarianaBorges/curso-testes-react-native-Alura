import { obtemLeiloes, obtemLeilao } from '../../src/repositorio/leilao';
import apiLeiloes from '../../src/servicos/apiLeiloes';

jest.mock('../../src/servicos/apiLeiloes');

const mockLeiloes = [
    {
        id: 1,
        nome: 'Leilão',
        descricao: 'descrição de um leilão'
    }
]
const mockLeilao = {
    id: 1,
    nome: 'Leilão',
    descricao: 'descrição de um leilão'
}

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

describe('repositorio/leilao', ()=>{

    beforeEach(()=>{
        //limpa a requisição
        apiLeiloes.get.mockClear()
    })

    describe('obtemLeiloes', () => {
        it('deve retornar uma lista de leilões', async () =>{
            apiLeiloes.get.mockImplementation(() => mockRequisicao(mockLeiloes))
            const leiloes = await obtemLeiloes();

            expect(leiloes).toEqual(mockLeiloes);

            expect(apiLeiloes.get).toHaveBeenCalledWith('/leiloes');
            expect(apiLeiloes.get).toHaveBeenCalledTimes(1);
        });

        it('deve retornar uma lista vazia quando a requisição falhar', async () =>{
            apiLeiloes.get.mockImplementation(() => mockRequisicaoErro())
            const leiloes = await obtemLeiloes();

            expect(leiloes).toEqual([]);
            
            expect(apiLeiloes.get).toHaveBeenCalledWith('/leiloes');
            expect(apiLeiloes.get).toHaveBeenCalledTimes(1);
        });
    });

    describe("Obtem um leilão", ()=>{
        it("Deve retornar o leilão de id 1", async ()=>{
            const id = 1;
            apiLeiloes.get.mockImplementation(() => mockRequisicao(mockLeilao))
            const leiloes = await obtemLeilao(id);

            expect(leiloes).toEqual(mockLeilao);

            expect(apiLeiloes.get).toHaveBeenCalledWith(`/leiloes/${id}`);
            expect(apiLeiloes.get).toHaveBeenCalledTimes(1);
        })

        it('deve retornar um objeto vazio quando a requisição falhar', async () =>{
            const id = 1;
            apiLeiloes.get.mockImplementation(() => mockRequisicaoErro())
            const leiloes = await obtemLeilao(id);

            expect(leiloes).toEqual({});

            expect(apiLeiloes.get).toHaveBeenCalledWith(`/leiloes/${id}`);
            expect(apiLeiloes.get).toHaveBeenCalledTimes(1);
        
        
        });
    })
});
