import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { NotepadText, Download, RefreshCcw, Trash2, Copy } from "lucide-react";
import { useState } from "react";

interface ActionButtonsProps {
  onSavePlan: (name: string) => void;
  onRegenerateWithLocked: () => void;
  onClearLocked: () => void;
  onCopyShoppingList: () => void;
  shoppingList: string[];
  lockedItemsCount: number;
  planInfo: {
    dietType?: string;
    calorieTarget?: number;
    date: string;
  };
}

export function ActionButtons({
  onSavePlan,
  onRegenerateWithLocked,
  onClearLocked,
  onCopyShoppingList,
  shoppingList,
  lockedItemsCount,
  planInfo,
}: ActionButtonsProps) {
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [saveName, setSaveName] = useState("");

  const handleSave = () => {
    if (!saveName.trim()) return;
    onSavePlan(saveName);
    setSaveDialogOpen(false);
    setSaveName("");
  };

  return (
    <div className="space-y-2">
      {/* Save Plan */}
      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <NotepadText className="mr-2 h-4 w-4" />
            Save Plan
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Save Meal Plan</DialogTitle>
            <DialogDescription>
              Enter a name for your meal plan to save it for future reference.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Example: Low Carb Week"
              value={saveName}
              onChange={(e) => setSaveName(e.target.value)}
            />
            <div className="flex gap-2 justify-end">
              <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSave}>Save</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Shopping List */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="w-full">
            <Download className="mr-2 h-4 w-4" />
            Shopping List
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Shopping List</DialogTitle>
          </DialogHeader>
          <div className="relative">
            <ScrollArea className="h-[300px]">
              <div className="space-y-4">
                <div className="p-3 bg-muted rounded-md text-sm">
                  <p><strong>Date:</strong> {planInfo.date}</p>
                  {planInfo.dietType && (
                    <p><strong>Diet:</strong> {planInfo.dietType}</p>
                  )}
                  {planInfo.calorieTarget && (
                    <p><strong>Calories:</strong> {planInfo.calorieTarget} kcal</p>
                  )}
                </div>
                <div>
                  <h4 className="font-semibold mb-2">
                    Ingredients ({shoppingList.length})
                  </h4>
                  <ul className="space-y-1">
                    {shoppingList.map((item, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <div className="w-2 h-2 bg-primary rounded-full" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </ScrollArea>
            <Button
              variant="ghost"
              size="sm"
              onClick={onCopyShoppingList}
              className="absolute top-2 right-2"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Other Actions */}
      <Button
        variant="secondary"
        onClick={onRegenerateWithLocked}
        className="w-full"
      >
        <RefreshCcw className="mr-2 h-4 w-4" />
        Regenerate with Locked
      </Button>

      {lockedItemsCount > 0 && (
        <Button
          variant="secondary"
          onClick={onClearLocked}
          className="w-full cursor-pointer"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Clean Lockeds ({lockedItemsCount})
        </Button>
      )}
    </div>
  );
}