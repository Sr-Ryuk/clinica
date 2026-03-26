<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class RoomWebController extends Controller
{
    public function index(): Response
    {
        $rooms = Room::with('equipment')
            ->withCount(['classes as active_classes' => fn($q) => $q->where('active', true)])
            ->orderBy('name')
            ->get()
            ->map(fn($r) => [
                'id'             => $r->id,
                'name'           => $r->name,
                'capacity'       => $r->capacity,
                'description'    => $r->description,
                'active'         => $r->active,
                'active_classes' => $r->active_classes,
                'equipment'      => $r->equipment->map(fn($e) => [
                    'id'       => $e->id,
                    'name'     => $e->name,
                    'type'     => $e->type,
                    'quantity' => $e->quantity,
                    'brand'    => $e->brand,
                    'active'   => $e->active,
                ]),
            ]);

        return Inertia::render('Rooms/Index', ['rooms' => $rooms]);
    }

    public function create(): Response
    {
        return Inertia::render('Rooms/Create');
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name'               => ['required', 'string', 'max:255'],
            'capacity'           => ['required', 'integer', 'min:1'],
            'description'        => ['nullable', 'string'],
            'equipment'          => ['nullable', 'array'],
            'equipment.*.name'   => ['required', 'string', 'max:255'],
            'equipment.*.type'   => ['nullable', 'string', 'max:100'],
            'equipment.*.quantity' => ['required', 'integer', 'min:1'],
            'equipment.*.brand'  => ['nullable', 'string', 'max:100'],
        ]);

        $room = Room::create([
            'name'        => $data['name'],
            'capacity'    => $data['capacity'],
            'description' => $data['description'] ?? null,
            'active'      => true,
        ]);

        foreach ($data['equipment'] ?? [] as $eq) {
            $room->equipment()->create(array_merge($eq, ['active' => true]));
        }

        return redirect()->route('rooms.index')
            ->with('success', 'Sala criada com sucesso.');
    }

    public function edit(Room $room): Response
    {
        $room->load('equipment');

        return Inertia::render('Rooms/Edit', [
            'room' => [
                'id'          => $room->id,
                'name'        => $room->name,
                'capacity'    => $room->capacity,
                'description' => $room->description,
                'active'      => $room->active,
                'equipment'   => $room->equipment->map(fn($e) => [
                    'id'       => $e->id,
                    'name'     => $e->name,
                    'type'     => $e->type,
                    'quantity' => $e->quantity,
                    'brand'    => $e->brand,
                    'active'   => $e->active,
                ])->toArray(),
            ],
        ]);
    }

    public function update(Request $request, Room $room)
    {
        $data = $request->validate([
            'name'               => ['required', 'string', 'max:255'],
            'capacity'           => ['required', 'integer', 'min:1'],
            'description'        => ['nullable', 'string'],
            'active'             => ['boolean'],
            'equipment'          => ['nullable', 'array'],
            'equipment.*.id'     => ['nullable', 'integer'],
            'equipment.*.name'   => ['required', 'string', 'max:255'],
            'equipment.*.type'   => ['nullable', 'string', 'max:100'],
            'equipment.*.quantity' => ['required', 'integer', 'min:1'],
            'equipment.*.brand'  => ['nullable', 'string', 'max:100'],
            'equipment.*.active' => ['boolean'],
        ]);

        $room->update([
            'name'        => $data['name'],
            'capacity'    => $data['capacity'],
            'description' => $data['description'] ?? null,
            'active'      => $data['active'] ?? true,
        ]);

        // Sincroniza equipamentos: atualiza existentes, cria novos
        $keptIds = [];
        foreach ($data['equipment'] ?? [] as $eq) {
            if (!empty($eq['id'])) {
                $room->equipment()->where('id', $eq['id'])->update([
                    'name'     => $eq['name'],
                    'type'     => $eq['type'] ?? null,
                    'quantity' => $eq['quantity'],
                    'brand'    => $eq['brand'] ?? null,
                    'active'   => $eq['active'] ?? true,
                ]);
                $keptIds[] = $eq['id'];
            } else {
                $new = $room->equipment()->create(array_merge($eq, ['active' => true]));
                $keptIds[] = $new->id;
            }
        }

        // Remove os que não vieram no payload
        $room->equipment()->whereNotIn('id', $keptIds)->delete();

        return redirect()->route('rooms.index')
            ->with('success', 'Sala atualizada com sucesso.');
    }

    public function destroy(Room $room)
    {
        $activeClasses = $room->classes()->where('active', true)->count();

        if ($activeClasses > 0) {
            return redirect()->route('rooms.index')
                ->with('error', "Não é possível remover: {$activeClasses} aula(s) ativa(s) nesta sala.");
        }

        $room->update(['active' => false]);

        return redirect()->route('rooms.index')
            ->with('success', 'Sala desativada com sucesso.');
    }
}