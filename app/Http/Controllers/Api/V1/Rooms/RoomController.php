<?php

namespace App\Http\Controllers\Api\V1\Rooms;

use App\Http\Controllers\Controller;
use App\Models\Room;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class RoomController extends Controller
{
    public function index(): JsonResponse
    {
        $rooms = Room::with('equipment')
            ->where('active', true)
            ->orderBy('name')
            ->get()
            ->map(fn($r) => $this->format($r));

        return response()->json($rooms);
    }

    public function show(Room $room): JsonResponse
    {
        $room->load('equipment');

        return response()->json($this->format($room));
    }

    public function store(Request $request): JsonResponse
    {
        $data = $request->validate([
            'name'        => ['required', 'string', 'max:255'],
            'capacity'    => ['required', 'integer', 'min:1'],
            'description' => ['nullable', 'string'],
            'equipment'   => ['nullable', 'array'],
            'equipment.*.name'     => ['required', 'string', 'max:255'],
            'equipment.*.type'     => ['nullable', 'string', 'max:100'],
            'equipment.*.quantity' => ['required', 'integer', 'min:1'],
            'equipment.*.brand'    => ['nullable', 'string', 'max:100'],
        ]);

        $room = Room::create([
            'name'        => $data['name'],
            'capacity'    => $data['capacity'],
            'description' => $data['description'] ?? null,
            'active'      => true,
        ]);

        if (! empty($data['equipment'])) {
            foreach ($data['equipment'] as $eq) {
                $room->equipment()->create(array_merge($eq, ['active' => true]));
            }
        }

        $room->load('equipment');

        return response()->json($this->format($room), 201);
    }

    public function update(Request $request, Room $room): JsonResponse
    {
        $data = $request->validate([
            'name'        => ['sometimes', 'string', 'max:255'],
            'capacity'    => ['sometimes', 'integer', 'min:1'],
            'description' => ['sometimes', 'nullable', 'string'],
            'active'      => ['sometimes', 'boolean'],
        ]);

        $room->update($data);
        $room->load('equipment');

        return response()->json($this->format($room));
    }

    public function destroy(Room $room): JsonResponse
    {
        $room->update(['active' => false]);

        return response()->json(['message' => 'Sala desativada com sucesso.']);
    }

    private function format(Room $room): array
    {
        return [
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
            ]),
        ];
    }
}
