
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface Set {
  id: string;
  weight: number;
  reps: number;
  rpe: number;
}

interface Exercise {
  id: string;
  name: string;
  warmupSets: Set[];
  workingSets: Set[];
}

interface Workout {
  id: string;
  date: string;
  exercises: Exercise[];
}

const commonExercises = [
  'Squat', 'Bench Press', 'Deadlift', 'Overhead Press', 'Barbell Row',
  'Pull-ups', 'Dips', 'Bulgarian Split Squat', 'Romanian Deadlift', 'Hip Thrust',
  'Incline Bench Press', 'Close-Grip Bench Press', 'Sumo Deadlift', 'Front Squat'
];

const WorkoutLogTab = () => {
  const [currentWorkout, setCurrentWorkout] = useState<Workout>({
    id: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    exercises: []
  });
  
  const [savedWorkouts, setSavedWorkouts] = useState<Workout[]>([]);
  const [showMuscleMap, setShowMuscleMap] = useState(false);

  const addExercise = () => {
    const newExercise: Exercise = {
      id: Date.now().toString(),
      name: '',
      warmupSets: [],
      workingSets: []
    };
    
    setCurrentWorkout({
      ...currentWorkout,
      exercises: [...currentWorkout.exercises, newExercise]
    });
  };

  const updateExercise = (exerciseId: string, field: keyof Exercise, value: any) => {
    setCurrentWorkout({
      ...currentWorkout,
      exercises: currentWorkout.exercises.map(ex => 
        ex.id === exerciseId ? { ...ex, [field]: value } : ex
      )
    });
  };

  const removeExercise = (exerciseId: string) => {
    setCurrentWorkout({
      ...currentWorkout,
      exercises: currentWorkout.exercises.filter(ex => ex.id !== exerciseId)
    });
  };

  const addSet = (exerciseId: string, type: 'warmup' | 'working') => {
    const newSet: Set = {
      id: Date.now().toString(),
      weight: 0,
      reps: 0,
      rpe: 6.5
    };
    
    setCurrentWorkout({
      ...currentWorkout,
      exercises: currentWorkout.exercises.map(ex => 
        ex.id === exerciseId 
          ? {
              ...ex,
              [type === 'warmup' ? 'warmupSets' : 'workingSets']: [
                ...(type === 'warmup' ? ex.warmupSets : ex.workingSets),
                newSet
              ]
            }
          : ex
      )
    });
  };

  const updateSet = (exerciseId: string, setId: string, type: 'warmup' | 'working', field: keyof Set, value: any) => {
    setCurrentWorkout({
      ...currentWorkout,
      exercises: currentWorkout.exercises.map(ex => 
        ex.id === exerciseId 
          ? {
              ...ex,
              [type === 'warmup' ? 'warmupSets' : 'workingSets']: 
                (type === 'warmup' ? ex.warmupSets : ex.workingSets).map(set =>
                  set.id === setId ? { ...set, [field]: value } : set
                )
            }
          : ex
      )
    });
  };

  const removeSet = (exerciseId: string, setId: string, type: 'warmup' | 'working') => {
    setCurrentWorkout({
      ...currentWorkout,
      exercises: currentWorkout.exercises.map(ex => 
        ex.id === exerciseId 
          ? {
              ...ex,
              [type === 'warmup' ? 'warmupSets' : 'workingSets']: 
                (type === 'warmup' ? ex.warmupSets : ex.workingSets).filter(set => set.id !== setId)
            }
          : ex
      )
    });
  };

  const saveWorkout = () => {
    if (currentWorkout.exercises.length === 0) return;
    
    const workoutToSave: Workout = {
      ...currentWorkout,
      id: Date.now().toString()
    };
    
    setSavedWorkouts([...savedWorkouts, workoutToSave]);
    setCurrentWorkout({
      id: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      exercises: []
    });
    setShowMuscleMap(true);
  };

  const getMuscleGroups = (workout: Workout) => {
    // Simple muscle group mapping based on exercise names
    const muscleMap: { [key: string]: string[] } = {
      'squat': ['quads', 'glutes'],
      'bench': ['chest', 'triceps', 'shoulders'],
      'deadlift': ['back', 'hamstrings', 'glutes'],
      'row': ['back', 'biceps'],
      'press': ['shoulders', 'triceps'],
      'pull': ['back', 'biceps']
    };
    
    const engagedMuscles = new Set<string>();
    
    workout.exercises.forEach(exercise => {
      const exerciseName = exercise.name.toLowerCase();
      Object.keys(muscleMap).forEach(key => {
        if (exerciseName.includes(key)) {
          muscleMap[key].forEach(muscle => engagedMuscles.add(muscle));
        }
      });
    });
    
    return Array.from(engagedMuscles);
  };

  const renderSetInputs = (exercise: Exercise, sets: Set[], type: 'warmup' | 'working') => (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <h4 className="font-medium capitalize">{type} Sets</h4>
        <Button
          size="sm"
          onClick={() => addSet(exercise.id, type)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus size={16} />
        </Button>
      </div>
      
      {sets.map((set, index) => (
        <div key={set.id} className="grid grid-cols-4 gap-2 items-center">
          <div>
            <Label className="text-xs">Weight</Label>
            <Input
              type="number"
              value={set.weight}
              onChange={(e) => updateSet(exercise.id, set.id, type, 'weight', parseFloat(e.target.value) || 0)}
              className="bg-slate-700 border-slate-600 text-sm"
              placeholder="kg"
            />
          </div>
          <div>
            <Label className="text-xs">Reps</Label>
            <Input
              type="number"
              value={set.reps}
              onChange={(e) => updateSet(exercise.id, set.id, type, 'reps', parseInt(e.target.value) || 0)}
              className="bg-slate-700 border-slate-600 text-sm"
              placeholder="reps"
            />
          </div>
          <div>
            <Label className="text-xs">RPE</Label>
            <Select
              value={set.rpe.toString()}
              onValueChange={(value) => updateSet(exercise.id, set.id, type, 'rpe', parseFloat(value))}
            >
              <SelectTrigger className="bg-slate-700 border-slate-600 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 border-slate-600">
                {['6.5', '7', '7.5', '8', '8.5', '9', '9.5', '10'].map(rpe => (
                  <SelectItem key={rpe} value={rpe}>{rpe}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => removeSet(exercise.id, set.id, type)}
            className="border-red-600 text-red-400 hover:bg-red-600"
          >
            <Trash2 size={16} />
          </Button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="p-4 space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Workout Log</h2>
        <div className="flex items-center gap-2">
          <Calendar size={16} />
          <Input
            type="date"
            value={currentWorkout.date}
            onChange={(e) => setCurrentWorkout({...currentWorkout, date: e.target.value})}
            className="bg-slate-700 border-slate-600 w-auto"
          />
        </div>
      </div>

      {/* Current Workout */}
      <Card className="bg-slate-800 border-slate-700">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Current Workout</CardTitle>
            <Button onClick={addExercise} className="bg-blue-600 hover:bg-blue-700">
              <Plus size={16} />
              Add Exercise
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentWorkout.exercises.map((exercise) => (
            <Card key={exercise.id} className="bg-slate-700 border-slate-600">
              <CardContent className="p-4 space-y-4">
                <div className="flex justify-between items-center">
                  <Select
                    value={exercise.name}
                    onValueChange={(value) => updateExercise(exercise.id, 'name', value)}
                  >
                    <SelectTrigger className="bg-slate-600 border-slate-500 flex-1 mr-2">
                      <SelectValue placeholder="Select exercise" />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-600 border-slate-500">
                      {commonExercises.map(ex => (
                        <SelectItem key={ex} value={ex}>{ex}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => removeExercise(exercise.id)}
                    className="border-red-600 text-red-400 hover:bg-red-600"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
                
                {renderSetInputs(exercise, exercise.warmupSets, 'warmup')}
                {renderSetInputs(exercise, exercise.workingSets, 'working')}
              </CardContent>
            </Card>
          ))}
          
          {currentWorkout.exercises.length > 0 && (
            <Button
              onClick={saveWorkout}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              Save Workout
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Muscle Map Modal */}
      {showMuscleMap && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle>Muscles Worked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="w-32 h-48 mx-auto bg-slate-700 rounded-lg flex items-center justify-center mb-4">
                <span className="text-sm text-slate-400">Body Diagram</span>
              </div>
              <p className="text-sm text-slate-400">
                Muscles engaged: {getMuscleGroups(savedWorkouts[savedWorkouts.length - 1] || currentWorkout).join(', ')}
              </p>
              <Button
                onClick={() => setShowMuscleMap(false)}
                className="mt-4 bg-blue-600 hover:bg-blue-700"
              >
                Close
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Previous Workouts */}
      {savedWorkouts.length > 0 && (
        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle>Previous Workouts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {savedWorkouts.slice(-5).map((workout) => (
                <div key={workout.id} className="p-3 bg-slate-700 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{workout.date}</span>
                    <span className="text-sm text-slate-400">
                      {workout.exercises.length} exercises
                    </span>
                  </div>
                  <div className="text-xs text-slate-500 mt-1">
                    {workout.exercises.map(ex => ex.name).join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WorkoutLogTab;
