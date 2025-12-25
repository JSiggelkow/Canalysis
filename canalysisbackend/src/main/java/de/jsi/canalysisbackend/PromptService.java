package de.jsi.canalysisbackend;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PromptService {

    private final PromptRepository promptRepository;

    public List<Prompt> findAll() {
        return promptRepository.findAll();
    }

    public Optional<Prompt> findById(Long id) {
        return promptRepository.findById(id);
    }

    public Prompt save(Prompt prompt) {
        return promptRepository.save(prompt);
    }

    public void deleteById(Long id) {
        promptRepository.deleteById(id);
    }
}
