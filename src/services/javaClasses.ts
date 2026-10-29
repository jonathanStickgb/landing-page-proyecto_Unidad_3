export interface JavaClassFile {
  name: string;
  path: string;
  description: string;
  content: string;
}

export const JAVA_CLASSES: JavaClassFile[] = [
  {
    name: 'Attendee.java',
    path: 'src/main/java/co/edu/uptc/javai/model/Attendee.java',
    description: 'Entidad de persistencia Jakarta Persistence (JPA) con anotaciones de validación y auditoría.',
    content: `package co.edu.uptc.javai.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.Instant;
import java.util.UUID;

/**
 * Entidad de Asistente para Java & AI Day Boyacá 2026.
 * Sede: Auditorio Paraninfo San Jerónimo · UPTC Tunja.
 */
@Entity
@Table(name = "attendees", indexes = {
    @Index(name = "idx_attendees_email", columnList = "email"),
    @Index(name = "idx_attendees_ticket", columnList = "ticket_number", unique = true)
})
public class Attendee {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @NotBlank(message = "El nombre completo es obligatorio")
    @Size(min = 3, max = 100, message = "El nombre debe tener entre 3 y 100 caracteres")
    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @NotBlank(message = "El correo electrónico es obligatorio")
    @Email(message = "Formato de correo inválido")
    @Column(nullable = false, length = 120)
    private String email;

    @NotBlank
    @Column(nullable = false, length = 60)
    private String role; // 'Estudiante UPTC', 'Desarrollador / Ingeniero', etc.

    @NotBlank
    @Column(nullable = false, length = 120)
    private String organization;

    @NotBlank
    @Column(name = "attendance_type", nullable = false, length = 20)
    private String attendanceType; // 'presencial' o 'streaming'

    @NotBlank
    @Column(name = "primary_track", nullable = false, length = 50)
    private String primaryTrack;

    @NotBlank
    @Pattern(regexp = "^JAI-BOY-2026-[0-9]{4}$", message = "Formato de ticket inválido")
    @Column(name = "ticket_number", nullable = false, unique = true, length = 64)
    private String ticketNumber;

    @NotBlank
    @Column(nullable = false, length = 20)
    private String status; // 'confirmado', 'checkin', 'pendiente', 'cancelado'

    @Size(max = 500)
    @Column(length = 500)
    private String notes;

    @Column(name = "user_id", length = 128)
    private String userId;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    // Constructores
    public Attendee() {}

    public Attendee(String fullName, String email, String role, String organization,
                    String attendanceType, String primaryTrack, String ticketNumber, String status) {
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.organization = organization;
        this.attendanceType = attendanceType;
        this.primaryTrack = primaryTrack;
        this.ticketNumber = ticketNumber;
        this.status = status;
    }

    // Getters y Setters
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getOrganization() { return organization; }
    public void setOrganization(String organization) { this.organization = organization; }

    public String getAttendanceType() { return attendanceType; }
    public void setAttendanceType(String attendanceType) { this.attendanceType = attendanceType; }

    public String getPrimaryTrack() { return primaryTrack; }
    public void setPrimaryTrack(String primaryTrack) { this.primaryTrack = primaryTrack; }

    public String getTicketNumber() { return ticketNumber; }
    public void setTicketNumber(String ticketNumber) { this.ticketNumber = ticketNumber; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }

    public String getUserId() { return userId; }
    public void setUserId(String userId) { this.userId = userId; }

    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
`
  },
  {
    name: 'AttendeeRepository.java',
    path: 'src/main/java/co/edu/uptc/javai/repository/AttendeeRepository.java',
    description: 'Repositorio Spring Data JPA con métodos de consulta optimizados para PostgreSQL.',
    content: `package co.edu.uptc.javai.repository;

import co.edu.uptc.javai.model.Attendee;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface AttendeeRepository extends JpaRepository<Attendee, UUID> {

    Optional<Attendee> findByTicketNumber(String ticketNumber);

    Optional<Attendee> findByEmail(String email);

    List<Attendee> findByStatusOrderByCreatedAtDesc(String status);

    List<Attendee> findByRole(String role);

    @Query("SELECT a FROM Attendee a WHERE " +
           "LOWER(a.fullName) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(a.email) LIKE LOWER(CONCAT('%', :q, '%')) OR " +
           "LOWER(a.ticketNumber) LIKE LOWER(CONCAT('%', :q, '%'))")
    List<Attendee> searchAttendees(@Param("q") String query);

    long countByAttendanceType(String attendanceType);

    long countByStatus(String status);
}
`
  },
  {
    name: 'AttendeeService.java',
    path: 'src/main/java/co/edu/uptc/javai/service/AttendeeService.java',
    description: 'Capa de servicio transaccional con reglas de negocio, validación y check-in.',
    content: `package co.edu.uptc.javai.service;

import co.edu.uptc.javai.model.Attendee;
import co.edu.uptc.javai.repository.AttendeeRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Random;
import java.util.UUID;

@Service
@Transactional
public class AttendeeService {

    private final AttendeeRepository repository;

    public AttendeeService(AttendeeRepository repository) {
        this.repository = repository;
    }

    @Transactional(readOnly = true)
    public List<Attendee> findAll() {
        return repository.findAll();
    }

    @Transactional(readOnly = true)
    public Attendee findById(UUID id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Asistente no encontrado: " + id));
    }

    public Attendee register(Attendee attendee) {
        if (attendee.getTicketNumber() == null || attendee.getTicketNumber().isBlank()) {
            int randomNum = 1000 + new Random().nextInt(9000);
            attendee.setTicketNumber("JAI-BOY-2026-" + randomNum);
        }
        if (attendee.getStatus() == null) {
            attendee.setStatus("confirmado");
        }
        return repository.save(attendee);
    }

    public Attendee update(UUID id, Attendee updates) {
        Attendee existing = findById(id);
        existing.setFullName(updates.getFullName());
        existing.setEmail(updates.getEmail());
        existing.setRole(updates.getRole());
        existing.setOrganization(updates.getOrganization());
        existing.setAttendanceType(updates.getAttendanceType());
        existing.setPrimaryTrack(updates.getPrimaryTrack());
        existing.setStatus(updates.getStatus());
        existing.setNotes(updates.getNotes());
        return repository.save(existing);
    }

    public Attendee checkIn(UUID id) {
        Attendee attendee = findById(id);
        attendee.setStatus("checkin");
        return repository.save(attendee);
    }

    public void delete(UUID id) {
        repository.deleteById(id);
    }
}
`
  },
  {
    name: 'AttendeeController.java',
    path: 'src/main/java/co/edu/uptc/javai/controller/AttendeeController.java',
    description: 'Controlador REST con endpoints CRUD para captura de datos y acreditación.',
    content: `package co.edu.uptc.javai.controller;

import co.edu.uptc.javai.model.Attendee;
import co.edu.uptc.javai.service.AttendeeService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/v1/attendees")
@CrossOrigin(origins = "*")
public class AttendeeController {

    private final AttendeeService service;

    public AttendeeController(AttendeeService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Attendee>> listAll() {
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Attendee> getById(@PathVariable UUID id) {
        return ResponseEntity.ok(service.findById(id));
    }

    @PostMapping
    public ResponseEntity<Attendee> create(@Valid @RequestBody Attendee attendee) {
        Attendee created = service.register(attendee);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Attendee> update(@PathVariable UUID id, @Valid @RequestBody Attendee attendee) {
        return ResponseEntity.ok(service.update(id, attendee));
    }

    @PatchMapping("/{id}/checkin")
    public ResponseEntity<Attendee> checkIn(@PathVariable UUID id) {
        return ResponseEntity.ok(service.checkIn(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable UUID id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
}
`
  },
  {
    name: 'SecurityConfig.java',
    path: 'src/main/java/co/edu/uptc/javai/config/SecurityConfig.java',
    description: 'Configuración Spring Security 6 con reglas de autorización RBAC y CORS.',
    content: `package co.edu.uptc.javai.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Registro público y consulta de acreditación permitidos
                .requestMatchers(HttpMethod.POST, "/api/v1/attendees").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/v1/attendees/**").permitAll()
                // Control de Check-in y modificaciones restringidas
                .requestMatchers(HttpMethod.PUT, "/api/v1/attendees/**").authenticated()
                .requestMatchers(HttpMethod.PATCH, "/api/v1/attendees/**").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/v1/attendees/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            );

        return http.build();
    }
}
`
  },
  {
    name: 'application.yml',
    path: 'src/main/resources/application.yml',
    description: 'Configuración de conexión local PostgreSQL con Virtual Threads (Java 21+).',
    content: `spring:
  application:
    name: javai-boyaca-2026-backend
  threads:
    virtual:
      enabled: true # Activa Virtual Threads (Project Loom) en Java 21+
  datasource:
    url: jdbc:postgresql://localhost:5432/javai_boyaca_2026
    username: uptc_admin
    password: boyaca_tech_2026
    driver-class-name: org.postgresql.Driver
    hikari:
      maximum-pool-size: 15
      minimum-idle: 5
  jpa:
    database-platform: org.hibernate.dialect.PostgreSQLDialect
    hibernate:
      ddl-auto: validate # Valida con el script SQL provisto
    show-sql: true
    properties:
      hibernate:
        format_sql: true

server:
  port: 8080
`
  }
];
