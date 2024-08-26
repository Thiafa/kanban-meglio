<?php

namespace App\Http\Controllers;

use App\Http\Resources\TarefaResource;
use App\Models\r;
use App\Models\Tarefa;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class TarefaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): JsonResponse
    {
        $tarefas = Tarefa::search($request)->where('user_id', auth()->user()->id)->get();

        if ($tarefas->isEmpty()) {
            return response()->json([
                'message' => 'Nenhum tarefa encontrada.',
                'status' => false
            ], 204);
        }

        return (TarefaResource::collection($tarefas))->additional([
            'message' => 'Listagem de todas as tarefas!',
            'status' => True
        ])->response()->setStatusCode(200);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $data = $request->validated();
            $tarefa = Tarefa::create($data);
            return (new TarefaResource($tarefa))->additional([
                'message' => 'Tarefa criado com sucesso!',
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
    public function show(string $id): JsonResponse
    {
        try {
            $tarefa = Tarefa::findOrFail($id);
            return (new TarefaResource($tarefa))->additional([
                'message' => 'Detalhes do tarefa!',
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
    public function update(Request $request, string $id): JsonResponse
    {
        try {
            $tarefa = Tarefa::findOrFail($id);
            $data = $request->validated();
            $tarefa->update($data);
            return (new TarefaResource($tarefa))->additional([
                'message' => 'Tarefa atualizado com sucesso!',
                'status' => true
            ])->response()->setStatusCode(200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => 'Erro ao atualizar tarefa: ' . $th->getMessage(),
            ], 400);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $arefa = Tarefa::findOrFail($id);
            $arefa->delete();
            return response()->json([
                'status' => true,
                'message' => 'Tarefa deletada com sucesso!',
            ], 200);
        } catch (\Throwable $th) {
            return response()->json([
                'status' => false,
                'message' => $th->getMessage(),
            ], 400);
        }
    }
}
