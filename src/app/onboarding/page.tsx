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

const STEPS = ["Basics", "Body", "Lifestyle", "Face"];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    age: "",
    heightCm: "",
    weightKg: "",
    gender: "",
    goal: "",
    bodyfatEstimate: "",
    gymExperience: "",
    sleepHours: "",
    waterIntakeL: "",
    skincare: "",
    hairType: "",
    beardGrowth: "",
    jawVisibility: "",
    teethCondition: "",
    eyeArea: "",
    acne: "",
    faceSymmetry: "",
  });

  const update = (key: string, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const submit = async () => {
    setLoading(true);
    const res = await fetch("/api/onboarding", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
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
      }),
    });
    setLoading(false);

    if (!res.ok) {
      toast.error("Failed to save profile");
      return;
    }

    router.push("/upload");
    router.refresh();
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
                <Field label="Age" id="age" type="number" value={form.age} onChange={update} />
                <Field label="Height (cm)" id="heightCm" type="number" value={form.heightCm} onChange={update} />
                <Field label="Weight (kg)" id="weightKg" type="number" value={form.weightKg} onChange={update} />
                <SelectField label="Gender" value={form.gender} onChange={(v) => update("gender", v)} options={["Male", "Female", "Other"]} />
                <SelectField label="Primary Goal" value={form.goal} onChange={(v) => update("goal", v)} options={["Face aesthetics", "Body recomposition", "Overall glow up", "Confidence", "All of the above"]} />
              </>
            )}
            {step === 1 && (
              <>
                <Field label="Bodyfat Estimate (%)" id="bodyfatEstimate" type="number" value={form.bodyfatEstimate} onChange={update} />
                <SelectField label="Gym Experience" value={form.gymExperience} onChange={(v) => update("gymExperience", v)} options={["Beginner", "Intermediate", "Advanced", "None"]} />
                <Field label="Sleep (hours/night)" id="sleepHours" type="number" value={form.sleepHours} onChange={update} />
                <Field label="Water Intake (L/day)" id="waterIntakeL" type="number" value={form.waterIntakeL} onChange={update} />
              </>
            )}
            {step === 2 && (
              <>
                <SelectField label="Current Skincare" value={form.skincare} onChange={(v) => update("skincare", v)} options={["None", "Basic", "Advanced routine", "Dermatologist prescribed"]} />
                <SelectField label="Hair Type" value={form.hairType} onChange={(v) => update("hairType", v)} options={["Straight", "Wavy", "Curly", "Coily", "Thinning", "Bald/shaved"]} />
                <SelectField label="Beard Growth" value={form.beardGrowth} onChange={(v) => update("beardGrowth", v)} options={["None", "Patchy", "Moderate", "Full", "N/A"]} />
              </>
            )}
            {step === 3 && (
              <>
                <SelectField label="Jaw Visibility" value={form.jawVisibility} onChange={(v) => update("jawVisibility", v)} options={["Hidden by fat", "Slightly visible", "Defined", "Very defined"]} />
                <SelectField label="Teeth Condition" value={form.teethCondition} onChange={(v) => update("teethCondition", v)} options={["Excellent", "Good", "Average", "Needs work"]} />
                <SelectField label="Eye Area" value={form.eyeArea} onChange={(v) => update("eyeArea", v)} options={["Hunter eyes", "Average", "Tired/droopy", "Deep set", "Hooded"]} />
                <SelectField label="Acne" value={form.acne} onChange={(v) => update("acne", v)} options={["None", "Mild", "Moderate", "Severe"]} />
                <SelectField label="Face Symmetry (self-assess)" value={form.faceSymmetry} onChange={(v) => update("faceSymmetry", v)} options={["Very symmetric", "Slightly asymmetric", "Noticeably asymmetric", "Unsure"]} />
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
