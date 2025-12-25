package de.jsi.canalysisbackend;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "keywords")
public class Keyword {
	@Id
	@Column(name = "keyword", nullable = false)
	private String keyword;

	@Column(name = "language", length = 2)
	private String language;

}