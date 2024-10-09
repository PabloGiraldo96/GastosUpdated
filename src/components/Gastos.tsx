"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type GastosCasa = {
  arriendo: number;
  comida: number;
  servicios: number;
  une: number;
  bruce: number;
  pasajes: number;
  universidad: number;
  dolarC: number;
  otros: number;
  total: number;
  id: string;
};

export default function Gastos() {
  const [gastos, setGastos] = useState<GastosCasa[]>([]);
  const [currentGastos, setCurrentGastos] = useState<Partial<GastosCasa>>({});
  const [currentDateTime, setCurrentDateTime] = useState("");

  useEffect(() => {
    const savedGastos = localStorage.getItem("gastosCasa");
    if (savedGastos) {
      setGastos(JSON.parse(savedGastos));
    }

    const updateDateTime = () => {
      const now = new Date();
      setCurrentDateTime(now.toLocaleString());
    };

    updateDateTime();
    const timer = setInterval(updateDateTime, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem("gastosCasa", JSON.stringify(gastos));
  }, [gastos]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentGastos({
      ...currentGastos,
      [e.target.name]: parseFloat(e.target.value),
    });
  };

  const createNewGastos = () => {
    const {
      arriendo,
      comida,
      servicios,
      une,
      bruce,
      pasajes,
      universidad,
      dolarC,
      otros,
    } = currentGastos;

    if (
      [
        arriendo,
        comida,
        servicios,
        une,
        bruce,
        pasajes,
        universidad,
        dolarC,
        otros,
      ].some((value) => value === undefined || value === null)
    ) {
      alert("Por favor, completa todos los campos.");
      return;
    }

    const total =
      (arriendo || 0) +
      (comida || 0) +
      (servicios || 0) +
      (une || 0) +
      (bruce || 0) +
      (pasajes || 0) +
      (universidad || 0) +
      (dolarC || 0) +
      (otros || 0);

    const newGasto: GastosCasa = {
      arriendo: arriendo || 0,
      comida: comida || 0,
      servicios: servicios || 0,
      une: une || 0,
      bruce: bruce || 0,
      pasajes: pasajes || 0,
      universidad: universidad || 0,
      dolarC: dolarC || 0,
      otros: otros || 0,
      total,
      id: Date.now().toString(),
    };

    setGastos([...gastos, newGasto]);
    setCurrentGastos({});
  };

  const deleteAllGastos = () => {
    setGastos([]);
    localStorage.removeItem("gastosCasa");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          Gastos del Mes de Octubre
        </h1>
        <p className="text-center mb-6 text-gray-400"></p>

        <Card className="mb-8 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-purple-400">
              Nuevo Gasto
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { label: "Arriendo", name: "arriendo" },
                { label: "Comida", name: "comida" },
                { label: "Servicios", name: "servicios" },
                { label: "UNE", name: "une" },
                { label: "Bruce", name: "bruce" },
                { label: "Pasajes", name: "pasajes" },
                { label: "Universidad", name: "universidad" },
                { label: "DolarCity", name: "dolarC" },
                { label: "Otros", name: "otros" },
              ].map((input) => (
                <div key={input.name} className="space-y-2">
                  <Label
                    htmlFor={input.name}
                    className="text-sm font-medium text-gray-300"
                  >
                    {input.label}
                  </Label>
                  <Input
                    id={input.name}
                    name={input.name}
                    type="number"
                    placeholder={`Ingrese ${input.label.toLowerCase()}`}
                    value={currentGastos[input.name as keyof GastosCasa] || ""}
                    onChange={handleInputChange}
                    className="bg-gray-700 border-gray-600 text-gray-100 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              ))}
            </div>
            <Button
              onClick={createNewGastos}
              className="mt-6 w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
            >
              Añadir Nuevo Gasto
            </Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {gastos.map((gasto) => (
            <Card
              key={gasto.id}
              className="bg-gray-800 border-gray-700 hover:shadow-lg transition duration-300 ease-in-out transform hover:-translate-y-1"
            >
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-purple-400">
                  Gasto Total: ${gasto.total.toFixed(2)}
                </CardTitle>
                <p className="text-sm text-gray-400"></p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(gasto).map(([key, value]) => {
                    if (
                      key !== "id" &&
                      key !== "timestamp" &&
                      key !== "total"
                    ) {
                      return (
                        <p key={key} className="flex justify-between">
                          <span className="font-medium text-gray-300">
                            {key.charAt(0).toUpperCase() + key.slice(1)}:
                          </span>
                          <span className="text-gray-400">
                            ${(value as number).toFixed(2)}
                          </span>
                        </p>
                      );
                    }
                    return null;
                  })}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {gastos.length > 0 && (
          <div className="mt-8 text-center">
            <Button
              onClick={deleteAllGastos}
              variant="destructive"
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded transition duration-300 ease-in-out transform hover:scale-105"
            >
              Reiniciar Gastos
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
