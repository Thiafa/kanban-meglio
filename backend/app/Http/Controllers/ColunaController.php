<?php

namespace App\Http\Controllers;

use App\Http\Resources\ColunaResource;
use App\Models\Coluna;
use Illuminate\Http\Request;

class ColunaController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $colunas = Coluna::with('user')->where('user_id', auth()->user()->id)->get();
        // dd($colunas);
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
            $data = $request->validate(['nome' => 'required|string|max:35|unique:colunas,nome']);
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
    public function show(Coluna $coluna)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Coluna $coluna)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Coluna $coluna)
    {
        //
    }
}
