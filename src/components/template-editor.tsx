'use client';

import { useState, useEffect } from 'react';
import { Template } from '@/types';
import { RemotionPlayer } from '@/components/remotion-player';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Music, Image } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface TemplateEditorProps {
  template: Template;
  onSave: (values: any) => Promise<void>;
}

export function TemplateEditor({ template, onSave }: TemplateEditorProps) {
  const [values, setValues] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTab, setSelectedTab] = useState('preview');
  const { toast } = useToast();

  // Initialize form values from template inputs
  useEffect(() => {
    const initialValues = template.inputs.reduce((acc, input) => {
      acc[input.name] = input.default || '';
      return acc;
    }, {} as Record<string, any>);
    setValues(initialValues);
  }, [template]);

  const handleInputChange = (name: string, value: string) => {
    setValues(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = async (type: 'image' | 'audio', file: File) => {
    try {
      // TODO: Implement file upload to Supabase
      toast({
        title: 'File upload not implemented',
        description: 'File upload functionality will be implemented with Supabase storage.',
      });
    } catch (error) {
      toast({
        title: 'Upload failed',
        description: 'Failed to upload file. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const handleSave = async () => {
    try {
      setIsLoading(true);
      await onSave(values);
      toast({
        title: 'Saved successfully',
        description: 'Your changes have been saved.',
      });
    } catch (error) {
      toast({
        title: 'Save failed',
        description: 'Failed to save changes. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Preview */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Preview</CardTitle>
        </CardHeader>
        <CardContent>
          <RemotionPlayer
            remotionId={template.remotionId}
            inputProps={values}
            duration={template.duration}
          />
        </CardContent>
      </Card>

      {/* Editor */}
      <Card>
        <CardHeader>
          <CardTitle>Customize</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="media">Media</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              {template.inputs.map((input) => (
                <div key={input.name} className="space-y-2">
                  <Label htmlFor={input.name}>{input.label}</Label>
                  {input.type === 'textarea' ? (
                    <Textarea
                      id={input.name}
                      value={values[input.name] || ''}
                      onChange={(e) => handleInputChange(input.name, e.target.value)}
                      placeholder={input.placeholder}
                    />
                  ) : (
                    <Input
                      id={input.name}
                      type={input.type}
                      value={values[input.name] || ''}
                      onChange={(e) => handleInputChange(input.name, e.target.value)}
                      placeholder={input.placeholder}
                    />
                  )}
                </div>
              ))}
            </TabsContent>

            <TabsContent value="media" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Photos</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('photo-upload')?.click()}
                    >
                      <Image className="w-4 h-4 mr-2" />
                      Upload Photos
                    </Button>
                    <input
                      id="photo-upload"
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const files = e.target.files;
                        if (files) {
                          Array.from(files).forEach(file => handleFileUpload('image', file));
                        }
                      }}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Background Music</Label>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('audio-upload')?.click()}
                    >
                      <Music className="w-4 h-4 mr-2" />
                      Upload Music
                    </Button>
                    <input
                      id="audio-upload"
                      type="file"
                      accept="audio/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          handleFileUpload('audio', file);
                        }
                      }}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="preview">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                <RemotionPlayer
                  remotionId={template.remotionId}
                  inputProps={values}
                  duration={template.duration}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="mt-6">
            <Button
              onClick={handleSave}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 