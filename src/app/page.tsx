"use client";

import React, { useState, useRef, type ChangeEvent } from "react";
import Image from "next/image";
import { analyzeImage, type AnalyzeImageOutput } from "@/ai/flows/analyze-image";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Upload, Loader2, Image as ImageIcon, Users, Landmark, List } from "lucide-react";
import { Separator } from "@/components/ui/separator";

type State = {
  analysisResult: AnalyzeImageOutput | null;
  isLoading: boolean;
  error: string | null;
};

export default function Home() {
  const [imageDataUri, setImageDataUri] = useState<string | null>(null);
  const [state, setState] = useState<State>({ analysisResult: null, isLoading: false, error: null });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Reset state
      setState((prevState) => ({
        ...prevState,
        analysisResult: null,
        error: null,
        isLoading: true,
      }));
      setImageDataUri(null); // Show loading while processing file

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (!result.startsWith('data:image/')) {
          setState({
            analysisResult: null, isLoading: false, error: "Invalid file type. Please upload an image."
          })
          toast({
            title: "Invalid File Type",
            description: "Please upload a valid image file (e.g., PNG, JPG, GIF).",
            variant: "destructive",
          });
          return;
        }
        setImageDataUri(result)
        setState((prevState) => ({
          ...prevState,
          isLoading: false,
        }));
      };
      reader.onerror = () => {
        setState((prevState) => ({
          ...prevState,
          isLoading: false,
          error: "Failed to read the file.",
        }));
        toast({
          title: "File Read Error",
          description: "There was an error reading the selected file.",
          variant: "destructive",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeClick = async () => {
    if (!imageDataUri) {
      toast({
        title: "No Image Uploaded",
        description: "Please upload an image first.",
        variant: "destructive",
      });
      return;
    }

    setState({analysisResult: null, isLoading: true, error: null})

    try {
      const result = await analyzeImage({ photoDataUri: imageDataUri });
      setState((prevState) => ({
        ...prevState,
        analysisResult: result,
        isLoading: false,
        error: null
      }));

      toast({
        title: "Analysis Complete",
        description: "Image analysis finished successfully.",
      });
    } catch (err) {
      console.error("Analysis failed:", err);
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during analysis.";
      setState((prevState) => ({
        ...prevState,
        error: `Analysis failed: ${errorMessage}`,
      }));

      toast({
        title: "Analysis Failed",
        description: errorMessage,
        variant: "destructive",
      });

    } finally {
      setState((prevState) => ({ ...prevState, isLoading: false }));
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const renderResults = () => {
    if (!state.analysisResult) return null;

    const hasResults =
    state.analysisResult.objects?.length > 0 ||
    state.analysisResult.people?.length > 0 ||
    state.analysisResult.scenes?.length > 0;

    return (
      <div className="space-y-4">
        {hasResults ? (
          <>
            {state.analysisResult.objects && state.analysisResult.objects.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <List className="h-5 w-5 text-primary" /> Objects
                </h3>
                <div className="flex flex-wrap gap-2">
                  {state.analysisResult.objects.map((obj, index) => (
                    <Badge key={`obj-${index}`} variant="secondary">{obj}</Badge>
                  ))}
                </div>
              </div>
            )}
            {state.analysisResult.people && state.analysisResult.people.length > 0 && (
              <div className="space-y-2">
                 <Separator className="my-4" />
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Users className="h-5 w-5 text-primary" /> People
                </h3>
                <div className="flex flex-wrap gap-2">
                  {state.analysisResult.people.map((person, index) => (
                    <Badge key={`person-${index}`} variant="secondary">{person}</Badge> 
                  ))}
                </div>
              </div>
            )}
            {state.analysisResult.scenes && state.analysisResult.scenes.length > 0 && (
              <div className="space-y-2">
                <Separator className="my-4" />
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Landmark className="h-5 w-5 text-primary" /> Scenes
                </h3>
                <div className="flex flex-wrap gap-2">
                  {state.analysisResult.scenes.map((scene, index) => (
                   <Badge key={`scene-${index}`} variant="secondary">{scene}</Badge>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <p className="text-muted-foreground">No specific objects, people, or scenes were identified in the image.</p>
        )}
      </div>
    );
  };


  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 md:p-8 bg-secondary">
      <Card className="w-full max-w-2xl shadow-lg bg-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center flex items-center justify-center gap-2">
             <ImageIcon className="h-6 w-6 text-primary" /> Image Identifier
          </CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Upload an image and let AI identify objects, people, and scenes within it.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="image-upload" className="cursor-pointer flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors duration-200 bg-background">
              {imageDataUri ? (
                <div className="relative w-full h-64 rounded-md overflow-hidden mb-4">
                   <Image
                    src={imageDataUri}
                    alt="Uploaded preview"
                    layout="fill"
                    objectFit="contain"
                    className="rounded-md"
                  />
                </div>
              ) : (
                 <div className="flex flex-col items-center text-muted-foreground">
                    <Upload className="h-12 w-12 mb-2" />
                    <p>Click or drag & drop to upload an image</p>
                    <p className="text-xs">(PNG, JPG, GIF)</p>
                 </div>
              )}
               <Button type="button" variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); handleUploadClick(); }} className="mt-4">
                 {imageDataUri ? 'Change Image' : 'Select Image'}
              </Button>
            </Label>
            <Input
              id="image-upload"
              type="file"
              accept="image/png, image/jpeg, image/gif"
              onChange={handleFileChange}
              ref={fileInputRef}
              className="hidden"
            />
          </div>

          {state.error && (
            <p className="text-sm text-destructive text-center">{state.error}</p>
          )}

          {state.analysisResult && (
             <div className="p-4 border rounded-md bg-secondary">
                 {renderResults()}
              </div>
          )}
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button
            onClick={handleAnalyzeClick}
            disabled={!imageDataUri || state.isLoading}
            className="w-full md:w-auto bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            {state.isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4"><path d="M17.7 19.3 21 16l-3.3-3.3"/><path d="m21 16-4-4"/><path d="M6.3 5 3 8.3l3.3 3.3"/><path d="m3 8.3 4 4"/><path d="M12 3v18"/></svg>
                Analyze Image
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
