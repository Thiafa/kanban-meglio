<?php

namespace App\Http\Controllers;

use App\Http\Resources\ColunaResource;
use App\Models\Coluna;
use Exception;
use Illuminate\Http\Request;

class ColunaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $colunas = Coluna::with('user')->where('user_id', auth()->user()->id)->get();
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
            $data = $request->validate(['nome' => 'required|string|max:35']);
            $data['user_id'] = auth()->user()->id;
            $coluna = Coluna::create($data);
            return (new ColunaResource($coluna))->additional([
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
            $data = $request->validated();
            $coluna->update($data);
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
            $coluna = Coluna::where('user_id', auth()->user()->id)->findOrFail($id);
            // remover apenas se não existir coluna associada a nenhuma Tarefa
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
}
