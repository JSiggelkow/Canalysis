package de.jsi.canalysisbackend;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "prompts")
public class Prompt {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id", nullable = false)
	private Long id;

	@Column(name = "name", nullable = false, unique = true)
	private String name;

	@Column(name = "prompt", nullable = false, length = Integer.MAX_VALUE)
	private String prompt;

	@Column(name = "language", nullable = false, length = 2)
	private String language;

}