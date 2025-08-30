import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { X, Plus, Edit3, Trash2, StickyNote } from "lucide-react";

interface StickyNote {
  id: string;
  content: string;
  color: string;
  createdAt: string;
}

interface StickyNotesProps {
  isOpen: boolean;
  onClose: () => void;
}

const noteColors = [
  "bg-yellow-200 border-yellow-300",
  "bg-blue-200 border-blue-300", 
  "bg-green-200 border-green-300",
  "bg-pink-200 border-pink-300",
  "bg-purple-200 border-purple-300"
];

export default function StickyNotes({ isOpen, onClose }: StickyNotesProps) {
  const [notes, setNotes] = useState<StickyNote[]>([
    {
      id: "1",
      content: "Remember to call mom tonight!",
      color: noteColors[0],
      createdAt: "Today"
    },
    {
      id: "2", 
      content: "Meeting with team tomorrow at 2 PM",
      color: noteColors[1],
      createdAt: "Yesterday"
    }
  ]);
  const [newNote, setNewNote] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const addNote = () => {
    if (!newNote.trim()) return;

    const note: StickyNote = {
      id: Date.now().toString(),
      content: newNote,
      color: noteColors[Math.floor(Math.random() * noteColors.length)],
      createdAt: "Just now"
    };

    setNotes(prev => [note, ...prev]);
    setNewNote("");
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
  };

  const editNote = (id: string, content: string) => {
    setNotes(prev => prev.map(note => 
      note.id === id ? { ...note, content } : note
    ));
    setEditingId(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <Card className="w-[600px] h-[600px] bg-background border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-2">
            <StickyNote className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-semibold bg-gradient-primary bg-clip-text text-transparent">
              Sticky Notes
            </h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4 h-[calc(100%-100px)]">
          {/* Add new note */}
          <div className="space-y-2">
            <Textarea
              placeholder="Write a quick note..."
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="resize-none"
              rows={3}
            />
            <Button onClick={addNote} className="w-full" disabled={!newNote.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              Add Note
            </Button>
          </div>

          {/* Notes list */}
          <ScrollArea className="flex-1">
            <div className="space-y-3">
              {notes.map((note) => (
                <Card key={note.id} className={`${note.color} border-2`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      {editingId === note.id ? (
                        <Textarea
                          defaultValue={note.content}
                          className="flex-1 bg-transparent border-none resize-none text-gray-800"
                          rows={2}
                          onBlur={(e) => editNote(note.id, e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                              e.preventDefault();
                              editNote(note.id, e.currentTarget.value);
                            }
                          }}
                          autoFocus
                        />
                      ) : (
                        <p className="flex-1 text-gray-800 text-sm leading-relaxed">
                          {note.content}
                        </p>
                      )}
                      
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 text-gray-600 hover:text-gray-800"
                          onClick={() => setEditingId(note.id)}
                        >
                          <Edit3 className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon" 
                          className="h-6 w-6 text-gray-600 hover:text-red-600"
                          onClick={() => deleteNote(note.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    
                    <div className="mt-2 text-xs text-gray-600">
                      {note.createdAt}
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {notes.length === 0 && (
                <div className="text-center text-muted-foreground py-8">
                  <StickyNote className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p>No sticky notes yet. Add your first note above!</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}