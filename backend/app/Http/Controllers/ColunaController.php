<?php

namespace App\Http\Controllers;

use App\Http\Resources\ColunaResource;
use App\Models\Coluna;
use App\Models\Tarefa;
use Exception;
use Illuminate\Http\Request;

class ColunaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $colunas = Coluna::where('user_id', auth()->user()->id)->orderBy('order')->get();
        if ($colunas->isEmpty()) {
            return response()->json([
                'message' => 'Nenhum tarefa encontrada.',
                'status' => false
            ], 204);
        }

        return (ColunaResource::collection($colunas->all()))->additional([
            'message' => 'Listagem de todas as tarefas!',
            'status' => True
        ])->response()->setStatusCode(200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try {
            $lastOrder = Coluna::all()->max('order');
            $item = new Coluna();
            $item->nome = $request->nome;
            $item->color = $request->color;
            $item->order = $lastOrder + 1;
            $item->user_id = auth()->user()->id;
            $item->save();
            return (new ColunaResource($item))->additional([
                'message' => 'Coluna criado com sucesso!',
                'status' => True
            ])->response()->setStatusCode(201);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => $th->getMessage(),
            ], 400);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $coluna = Coluna::findOrFail($id);
            return (new ColunaResource($coluna))->additional([
                'message' => 'Detalhes do coluna!',
                'status' => True
            ])->response()->setStatusCode(200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => $th->getMessage(),
            ], 400);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        try {
            $coluna = Coluna::findOrFail($id);
            $data = $request->all();
            $coluna->nome = $data['nome'];
            $coluna->color = $data['color'];
            $coluna->save();

            return (new ColunaResource($coluna))->additional([
                'message' => 'Coluna atualizado com sucesso!',
                'status' => true
            ])->response()->setStatusCode(200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => 'Erro ao atualizar coluna: ' . $th->getMessage(),
            ], 400);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        try {
            $coluna = Coluna::with('user')->where('user_id', auth()->user()->id)->findOrFail($id);
            $tarefas = Tarefa::where('status', $coluna->id)->count();
            if ($tarefas > 0) {

                return response()->json([
                    'status' => false,
                    'message' => 'Não foi possível excluír a coluna pois existem tarefas associadas!',
                ], 400);
            }

            $coluna->delete();
            return response()->json([
                'status' => true,
                'message' => 'Coluna deletada com sucesso!',
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => $th->getMessage(),
            ], 400);
        }
    }

    public function reordenar(Request $request)
    {
        $colunas = $request->all();
        foreach ($colunas as $coluna) {
            $item = Coluna::find($coluna['id']);
            $item->order = $coluna['order'];
            $item->color = $coluna['color'];
            $item->save();
        }
        return response()->json(['message' => 'Coluna order updated successfully']);
    }
}
