package de.jsi.canalysisbackend;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/keywords")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:300"})
public class KeywordController {

    private final KeywordService keywordService;

    @GetMapping
    public List<Keyword> getAllKeywords() {
        return keywordService.findAll();
    }

    @GetMapping("/{keyword}")
    public ResponseEntity<Keyword> getKeywordById(@PathVariable String keyword) {
        return keywordService.findById(keyword)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public Keyword createKeyword(@RequestBody Keyword keyword) {
        return keywordService.save(keyword);
    }


    @DeleteMapping("/{keyword}")
    public ResponseEntity<Void> deleteKeyword(@PathVariable String keyword) {
        keywordService.deleteById(keyword);
        return ResponseEntity.noContent().build();
    }
}
