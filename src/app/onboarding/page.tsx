"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { useAppStorage } from "@/hooks/use-app-storage";

const STEPS = ["Basics", "Body", "Lifestyle", "Face"];

export default function OnboardingPage() {
  const router = useRouter();
  const { data, update } = useAppStorage();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    age: data.profile?.age?.toString() ?? "",
    heightCm: data.profile?.heightCm?.toString() ?? "",
    weightKg: data.profile?.weightKg?.toString() ?? "",
    gender: data.profile?.gender ?? "",
    goal: data.profile?.goal ?? "",
    bodyfatEstimate: data.profile?.bodyfatEstimate?.toString() ?? "",
    gymExperience: data.profile?.gymExperience ?? "",
    sleepHours: data.profile?.sleepHours?.toString() ?? "",
    waterIntakeL: data.profile?.waterIntakeL?.toString() ?? "",
    skincare: data.profile?.skincare ?? "",
    hairType: data.profile?.hairType ?? "",
    beardGrowth: data.profile?.beardGrowth ?? "",
    jawVisibility: data.profile?.jawVisibility ?? "",
    teethCondition: data.profile?.teethCondition ?? "",
    eyeArea: data.profile?.eyeArea ?? "",
    acne: data.profile?.acne ?? "",
    faceSymmetry: data.profile?.faceSymmetry ?? "",
  });

  const updateField = (key: string, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const submit = () => {
    setLoading(true);
    update((prev) => ({
      ...prev,
      onboardingComplete: true,
      profile: {
        age: Number(form.age),
        heightCm: Number(form.heightCm),
        weightKg: Number(form.weightKg),
        gender: form.gender,
        goal: form.goal,
        bodyfatEstimate: Number(form.bodyfatEstimate),
        gymExperience: form.gymExperience,
        sleepHours: Number(form.sleepHours),
        waterIntakeL: Number(form.waterIntakeL),
        skincare: form.skincare,
        hairType: form.hairType,
        beardGrowth: form.beardGrowth,
        jawVisibility: form.jawVisibility,
        teethCondition: form.teethCondition,
        eyeArea: form.eyeArea,
        acne: form.acne,
        faceSymmetry: form.faceSymmetry,
        currentStreak: prev.profile?.currentStreak ?? 0,
        longestStreak: prev.profile?.longestStreak ?? 0,
        lastActiveDate: prev.profile?.lastActiveDate ?? null,
      },
    }));
    toast.success("Profile saved");
    router.push("/upload");
    setLoading(false);
  };

  const next = () => {
    if (step < STEPS.length - 1) setStep(step + 1);
    else submit();
  };

  const progress = ((step + 1) / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-[#0a0a0f] px-6 py-8">
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-br from-violet-950/40 via-transparent to-indigo-950/30" />

      <div className="relative mx-auto max-w-md">
        <div className="mb-8">
          <p className="text-sm text-violet-400">Step {step + 1} of {STEPS.length}</p>
          <h1 className="mt-1 text-2xl font-bold text-white">{STEPS[step]}</h1>
          <Progress value={progress} className="mt-4" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-4"
          >
            {step === 0 && (
              <>
                <Field label="Age" id="age" type="number" value={form.age} onChange={updateField} />
                <Field label="Height (cm)" id="heightCm" type="number" value={form.heightCm} onChange={updateField} />
                <Field label="Weight (kg)" id="weightKg" type="number" value={form.weightKg} onChange={updateField} />
                <SelectField label="Gender" value={form.gender} onChange={(v) => updateField("gender", v)} options={["Male", "Female", "Other"]} />
                <SelectField label="Primary Goal" value={form.goal} onChange={(v) => updateField("goal", v)} options={["Face aesthetics", "Body recomposition", "Overall glow up", "Confidence", "All of the above"]} />
              </>
            )}
            {step === 1 && (
              <>
                <Field label="Bodyfat Estimate (%)" id="bodyfatEstimate" type="number" value={form.bodyfatEstimate} onChange={updateField} />
                <SelectField label="Gym Experience" value={form.gymExperience} onChange={(v) => updateField("gymExperience", v)} options={["Beginner", "Intermediate", "Advanced", "None"]} />
                <Field label="Sleep (hours/night)" id="sleepHours" type="number" value={form.sleepHours} onChange={updateField} />
                <Field label="Water Intake (L/day)" id="waterIntakeL" type="number" value={form.waterIntakeL} onChange={updateField} />
              </>
            )}
            {step === 2 && (
              <>
                <SelectField label="Current Skincare" value={form.skincare} onChange={(v) => updateField("skincare", v)} options={["None", "Basic", "Advanced routine", "Dermatologist prescribed"]} />
                <SelectField label="Hair Type" value={form.hairType} onChange={(v) => updateField("hairType", v)} options={["Straight", "Wavy", "Curly", "Coily", "Thinning", "Bald/shaved"]} />
                <SelectField label="Beard Growth" value={form.beardGrowth} onChange={(v) => updateField("beardGrowth", v)} options={["None", "Patchy", "Moderate", "Full", "N/A"]} />
              </>
            )}
            {step === 3 && (
              <>
                <SelectField label="Jaw Visibility" value={form.jawVisibility} onChange={(v) => updateField("jawVisibility", v)} options={["Hidden by fat", "Slightly visible", "Defined", "Very defined"]} />
                <SelectField label="Teeth Condition" value={form.teethCondition} onChange={(v) => updateField("teethCondition", v)} options={["Excellent", "Good", "Average", "Needs work"]} />
                <SelectField label="Eye Area" value={form.eyeArea} onChange={(v) => updateField("eyeArea", v)} options={["Hunter eyes", "Average", "Tired/droopy", "Deep set", "Hooded"]} />
                <SelectField label="Acne" value={form.acne} onChange={(v) => updateField("acne", v)} options={["None", "Mild", "Moderate", "Severe"]} />
                <SelectField label="Face Symmetry (self-assess)" value={form.faceSymmetry} onChange={(v) => updateField("faceSymmetry", v)} options={["Very symmetric", "Slightly asymmetric", "Noticeably asymmetric", "Unsure"]} />
              </>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex gap-3">
          {step > 0 && (
            <Button variant="secondary" onClick={() => setStep(step - 1)}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}
          <Button className="flex-1" onClick={next} disabled={loading}>
            {step < STEPS.length - 1 ? (
              <>Continue <ChevronRight className="h-4 w-4" /></>
            ) : loading ? (
              "Saving..."
            ) : (
              "Continue to Photos"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  id,
  type = "text",
  value,
  onChange,
}: {
  label: string;
  id: string;
  type?: string;
  value: string;
  onChange: (key: string, value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} type={type} value={value} onChange={(e) => onChange(id, e.target.value)} required />
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder={`Select ${label.toLowerCase()}`} />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o}>{o}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
