'use client';

import type { Template, InviteValues } from '@/types';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Music, Wand2, Loader2, Send } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useAuth } from './auth-provider';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';
import { suggestMusic } from '@/ai/flows/suggest-music'; 
import { handleRenderVideo } from '@/app/actions/render';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";


interface VideoEditorProps {
  template: Template;
}

export default function VideoEditor({ template }: VideoEditorProps) {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [isRendering, setIsRendering] = useState(false);
  const [isSuggestingMusic, setIsSuggestingMusic] = useState(false);
  const [musicSuggestions, setMusicSuggestions] = useState<string[]>([]);
  const [selectedMusic, setSelectedMusic] = useState<string>('');

  const formSchema = React.useMemo(() => {
    const shape: Record<string, z.ZodTypeAny> = {};
    template.inputs.forEach(input => {
      shape[input.name] = z.string().min(1, `${input.label} is required.`);
    });
    return z.object(shape);
  }, [template.inputs]);
  
  type FormValues = z.infer<typeof formSchema>;

  const defaultValues = template.inputs.reduce((acc, input) => {
    acc[input.name] = input.defaultValue || '';
    return acc;
  }, {} as Record<string, string>);

  const { control, handleSubmit, formState: { errors }, getValues } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues as FormValues,
  });

  const watchedValues = useWatch({ control });

  const handleMusicSuggestion = async () => {
    setIsSuggestingMusic(true);
    setMusicSuggestions([]);
    try {
      const result = await suggestMusic({ theme: template.theme || template.title });
      setMusicSuggestions(result.musicSuggestions || []);
      if (result.musicSuggestions && result.musicSuggestions.length > 0) {
        setSelectedMusic(result.musicSuggestions[0]);
      }
    } catch (error) {
      console.error('Error suggesting music:', error);
      toast({ variant: 'destructive', title: 'Music Suggestion Failed', description: 'Could not fetch music suggestions.' });
    } finally {
      setIsSuggestingMusic(false);
    }
  };

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast({ title: 'Authentication Required', description: 'Please sign in to render your video.', variant: 'destructive' });
      router.push('/auth');
      return;
    }
    setIsRendering(true);
    try {
      const inviteId = await handleRenderVideo({
        values: data as InviteValues,
        templateId: template.id,
        musicChoice: selectedMusic || undefined,
      }, template);
      toast({ title: 'Render Started!', description: 'Your video is being created. Check "My Invites" for progress.' });
      router.push(`/my-invites?highlight=${inviteId}`);
    } catch (error) {
      console.error('Error starting render:', error);
      toast({ variant: 'destructive', title: 'Render Failed', description: 'Could not start the video rendering process.' });
    } finally {
      setIsRendering(false);
    }
  };
  
  return (
    <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Customize Your Invitation</CardTitle>
          <CardDescription>Fill in the details for &quot;{template.title}&quot;</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            {template.inputs.map(input => (
              <div key={input.name} className="space-y-1.5">
                <Label htmlFor={input.name} className="font-medium">{input.label}</Label>
                <Controller
                  name={input.name as keyof FormValues}
                  control={control}
                  render={({ field }) => (
                    input.type === 'textarea' ? (
                      <Textarea id={input.name} placeholder={input.placeholder || `Enter ${input.label.toLowerCase()}`} {...field} className={errors[input.name] ? 'border-destructive' : ''} />
                    ) : input.type === 'date' ? (
                      <Input type="date" id={input.name} {...field} className={errors[input.name] ? 'border-destructive' : ''} />
                    ) : (
                      <Input id={input.name} placeholder={input.placeholder || `Enter ${input.label.toLowerCase()}`} {...field} className={errors[input.name] ? 'border-destructive' : ''} />
                    )
                  )}
                />
                {errors[input.name] && <p className="text-sm text-destructive">{errors[input.name]?.message as string}</p>}
              </div>
            ))}

            <Separator />

            <div className="space-y-3">
              <h3 className="text-lg font-semibold flex items-center"><Music className="mr-2 h-5 w-5 text-primary" /> Music Selection</h3>
              <Button type="button" variant="outline" onClick={handleMusicSuggestion} disabled={isSuggestingMusic}>
                {isSuggestingMusic ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                Suggest Royalty-Free Music
              </Button>
              {musicSuggestions.length > 0 && (
                 <Select value={selectedMusic} onValueChange={setSelectedMusic}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a suggested track" />
                    </SelectTrigger>
                    <SelectContent>
                      {musicSuggestions.map((music, index) => (
                        <SelectItem key={index} value={music}>
                          {music}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
              )}
               <div className="space-y-1.5">
                  <Label htmlFor="customMusic">Or provide your own music link (optional)</Label>
                  <Input id="customMusic" placeholder="https://example.com/music.mp3" value={selectedMusic} onChange={(e) => setSelectedMusic(e.target.value)} />
               </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" size="lg" disabled={isRendering || authLoading}>
              {isRendering ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
              {isRendering ? 'Processing...' : 'Create My Invitation'}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card className="sticky top-24 shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Live Preview (Static)</CardTitle>
          <CardDescription>See your changes as you type.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 p-6 bg-muted/30 rounded-md min-h-[300px]">
          <h3 className="text-xl font-semibold font-headline text-primary">{template.title}</h3>
          {template.inputs.map(input => {
            const value = watchedValues[input.name] || input.defaultValue || `[${input.label}]`;
            return (
              <div key={`preview-${input.name}`} className="text-sm">
                <strong className="text-foreground/80">{input.label}:</strong>
                <p className="pl-2 italic text-foreground whitespace-pre-wrap">{String(value)}</p>
              </div>
            );
          })}
          {selectedMusic && (
            <div className="text-sm pt-2 border-t mt-4">
              <strong className="text-foreground/80">Music:</strong>
              <p className="pl-2 italic text-foreground">{selectedMusic}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
