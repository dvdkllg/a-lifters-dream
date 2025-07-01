import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Clock, Trash2 } from 'lucide-react';

interface Supplement {
  id: string;
  name: string;
  pillsPerDose: number;
  scheduleTimes: string[];
}

const SupplementsTab = () => {
  const [supplements, setSupplements] = useState<Supplement[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    pillsPerDose: 1,
    scheduleTimes: ['']
  });

  const addTimeSlot = () => {
    setFormData({
      ...formData,
      scheduleTimes: [...formData.scheduleTimes, '']
    });
  };

  const updateTimeSlot = (index: number, value: string) => {
    const newTimes = [...formData.scheduleTimes];
    newTimes[index] = value;
    setFormData({ ...formData, scheduleTimes: newTimes });
  };

  const removeTimeSlot = (index: number) => {
    const newTimes = formData.scheduleTimes.filter((_, i) => i !== index);
    setFormData({ ...formData, scheduleTimes: newTimes });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newSupplement: Supplement = {
      id: Date.now().toString(),
      name: formData.name,
      pillsPerDose: formData.pillsPerDose,
      scheduleTimes: formData.scheduleTimes.filter(time => time !== '')
    };
    
    setSupplements([...supplements, newSupplement]);
    setFormData({ name: '', pillsPerDose: 1, scheduleTimes: [''] });
    setShowForm(false);
  };

  const deleteSupplement = (id: string) => {
    setSupplements(supplements.filter(sup => sup.id !== id));
  };

  const getNextDose = (scheduleTimes: string[]) => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();
    
    const times = scheduleTimes.map(time => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    }).sort((a, b) => a - b);
    
    const nextTime = times.find(time => time > currentTime) || times[0];
    const hours = Math.floor(nextTime / 60);
    const minutes = nextTime % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <div className="p-4 space-y-4 bg-black min-h-full">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-purple-400">Supplements</h2>
        <Button onClick={() => setShowForm(!showForm)} className="bg-purple-600 hover:bg-purple-700">
          <Plus size={16} />
          Add Supplement
        </Button>
      </div>

      {showForm && (
        <Card className="bg-gray-900 border-purple-800">
          <CardHeader>
            <CardTitle className="text-purple-400">Add New Supplement</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-gray-300">Supplement Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="pills" className="text-gray-300">Pills per Dose</Label>
                <Input
                  id="pills"
                  type="number"
                  min="1"
                  value={formData.pillsPerDose}
                  onChange={(e) => setFormData({ ...formData, pillsPerDose: parseInt(e.target.value) })}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              
              <div>
                <Label className="text-gray-300">Schedule Times</Label>
                {formData.scheduleTimes.map((time, index) => (
                  <div key={index} className="flex gap-2 mt-2">
                    <Input
                      type="time"
                      value={time}
                      onChange={(e) => updateTimeSlot(index, e.target.value)}
                      className="bg-gray-800 border-gray-700 text-white"
                    />
                    {formData.scheduleTimes.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeTimeSlot(index)}
                        className="border-gray-600 text-gray-300 hover:bg-gray-800"
                      >
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addTimeSlot}
                  className="mt-2 border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Add Time
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  Save Supplement
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-3">
        {supplements.map((supplement) => (
          <Card key={supplement.id} className="bg-gray-900 border-purple-800">
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg text-white flex items-center gap-2">
                    💊 {supplement.name}
                  </h3>
                  <p className="text-gray-300">{supplement.pillsPerDose} pill(s) per dose</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Clock size={16} className="text-purple-400" />
                    <span className="text-sm text-gray-300">Next dose: {getNextDose(supplement.scheduleTimes)}</span>
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Times: {supplement.scheduleTimes.join(', ')}
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deleteSupplement(supplement.id)}
                  className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {supplements.length === 0 && !showForm && (
        <div className="text-center py-8 text-gray-400">
          <p>No supplements added yet.</p>
          <p className="text-sm">Tap "Add Supplement" to get started.</p>
        </div>
      )}
    </div>
  );
};

export default SupplementsTab;
