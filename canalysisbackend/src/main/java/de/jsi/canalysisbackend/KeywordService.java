package de.jsi.canalysisbackend;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class KeywordService {

    private final KeywordRepository keywordRepository;

    public List<Keyword> findAll() {
        return keywordRepository.findAll();
    }

    public Optional<Keyword> findById(String keyword) {
        return keywordRepository.findById(keyword);
    }

    public Keyword save(Keyword keyword) {
        return keywordRepository.save(keyword);
    }

    public void deleteById(String keyword) {
        keywordRepository.deleteById(keyword);
    }
}
