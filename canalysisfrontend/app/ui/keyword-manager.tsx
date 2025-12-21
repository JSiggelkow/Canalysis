'use client'

import {useState} from "react";
import {Button, Card, Chip, Input, ScrollShadow} from "@heroui/react";
import {useAnalysis} from "@/app/context/AnalysisContext";
import {IconPlus, IconTrash} from "@tabler/icons-react";

export default function KeywordManager() {
    const {keywords, setKeywords} = useAnalysis();
    const [newKeyword, setNewKeyword] = useState("");

    const addKeyword = () => {
        if (newKeyword.trim() && !keywords.includes(newKeyword.trim())) {
            setKeywords([...keywords, newKeyword.trim()]);
            setNewKeyword("");
        }
    };

    const removeKeyword = (keywordToRemove: string) => {
        setKeywords(keywords.filter(k => k !== keywordToRemove));
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            addKeyword();
        }
    };

    return (
        <Card className="p-4 flex flex-col h-full overflow-hidden min-h-0">
            <h3 className="text-md font-semibold mb-4 flex-shrink-0">Analysis Keywords</h3>
            
            <div className="flex gap-2 mb-4 flex-shrink-0">
                <Input
                    size="sm"
                    placeholder="Add new keyword..."
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <Button 
                    isIconOnly 
                    size="sm" 
                    variant="flat" 
                    color="primary"
                    onPress={addKeyword}
                >
                    <IconPlus size={18} />
                </Button>
            </div>

            <ScrollShadow className="flex-grow min-h-0 pr-2">
                <div className="flex flex-wrap gap-2">
                    {keywords.length === 0 ? (
                        <p className="text-default-400 text-center py-4 text-xs italic w-full">No keywords defined</p>
                    ) : (
                        keywords.map((keyword, index) => (
                            <Chip 
                                key={index}
                                variant="flat"
                                color="default"
                                size="sm"
                                onClose={() => removeKeyword(keyword)}
                                className="pl-2"
                            >
                                {keyword}
                            </Chip>
                        ))
                    )}
                </div>
            </ScrollShadow>
        </Card>
    );
}
