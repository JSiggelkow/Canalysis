package de.jsi.canalysisbackend;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/prompts")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:300"})
public class PromptController {

    private final PromptService promptService;

    @GetMapping
    public List<Prompt> getAllPrompts() {
        return promptService.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Prompt> getPromptById(@PathVariable Long id) {
        return promptService.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Prompt createPrompt(@RequestBody Prompt prompt) {
        return promptService.save(prompt);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Prompt> updatePrompt(@PathVariable Long id, @RequestBody Prompt prompt) {
        return promptService.findById(id)
                .map(existingPrompt -> {
                    prompt.setId(id);
                    return ResponseEntity.ok(promptService.save(prompt));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePrompt(@PathVariable Long id) {
        promptService.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
