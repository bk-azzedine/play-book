package org.atlas.services;

import org.atlas.dtos.OrganizationDto;
import org.atlas.dtos.TeamsDto;
import org.atlas.entities.Organization;

import org.atlas.interfaces.CompanyServiceInterface;
import org.atlas.interfaces.TeamServiceInterface;
import org.atlas.interfaces.UserServiceInterface;
import org.atlas.repositories.OrganizationRepository;
import org.atlas.requests.OrganizationRequest;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.util.Random;
import java.util.UUID;

@Service
public class CompanyService implements CompanyServiceInterface {
    private final OrganizationRepository organizationRepository;
    private final UserServiceInterface userService;
    private final TeamServiceInterface teamService;

    private final ModelMapper modelMapper;
    final Logger logger =
            LoggerFactory.getLogger(CompanyService.class);

    @Autowired
    public CompanyService(OrganizationRepository organizationRepository, UserService userService, TeamService teamService, ModelMapper modelMapper, TeamServiceInterface teamServiceInterface) {
        this.organizationRepository = organizationRepository;
        this.userService = userService;
        this.teamService = teamService;
        this.modelMapper = modelMapper;

    }

    @Override
    public Mono<Organization> save(OrganizationRequest organization, String email) {
        logger.info("Initiating save operation for organization: {}", organization.name());
        return userService.getUserByEmail(email)
                .doOnNext(userId -> logger.debug("Retrieved userId: {}", userId))
                .flatMap(userId -> {
                    Organization newOrg = Organization.builder()
                            .name(organization.name())
                            .field(organization.field().name())
                            .ownerId(userId)
                            .initial(getInitials(organization.name()))
                            .color(getCompanyColor(organization.name()))
                            .build();
                    logger.debug("Constructed Organization entity: {}", newOrg);
                    return organizationRepository.save(newOrg)
                            .doOnSuccess(savedOrg -> logger.info("Successfully saved organization with ID: {}", savedOrg.getOrganizationId()));
                })
                .doOnError(error -> logger.error("Error occurred while saving organization", error));
    }
    @Override
    public Flux<OrganizationDto> findAllRelatedToUser(UUID userId) {
        logger.info("🔍 Fetching all organizations related to user ID: {}", userId);

        return organizationRepository.findAllRelatedToUser(userId)
                .doOnNext(org -> logger.debug("🏢 Found organization: {}", org))
                .flatMap(organization -> {
                    OrganizationDto dto = modelMapper.map(organization, OrganizationDto.class);
                    logger.debug("🧭 Mapped organization to DTO: {}", dto);

                    return teamService.getOrgTeams(dto.getOrganizationId())
                            .doOnNext(team -> logger.debug("👥 Found team: {}", team))
                            .collectList()
                            .map(teamsList -> {
                                dto.setTeams(teamsList);
                                logger.debug("🔗 Set teams on OrganizationDto: {}", dto);
                                return dto;
                            });
                })
                .doOnError(error -> logger.error("❌ Error while fetching organizations for userId {}: {}", userId, error.getMessage(), error))
                .doOnComplete(() -> logger.info("✅ Completed fetching all related organizations for userId: {}", userId));
    }


    /**
     * Extracts initials from a company name.
     *
     * @param companyName The company name to extract initials from
     * @return A string containing the initials
     */
    @Override
    public String getInitials(String companyName) {
        if (companyName == null || companyName.isEmpty()) {
            return "";
        }

        StringBuilder initials = new StringBuilder();

        // Split the company name by spaces and other common delimiters
        String[] words = companyName.split("[ \\-&,.]");

        for (String word : words) {
            if (!word.isEmpty()) {
                // Skip common words like "and", "of", "the", etc.
                if (!isCommonWord(word)) {
                    initials.append(Character.toUpperCase(word.charAt(0)));
                }
            }
        }

        return initials.toString();
    }

    /**
     * Checks if a word is a common word that should be excluded from initials.
     *
     * @param word The word to check
     * @return true if the word is common and should be excluded
     */
    @Override
    public boolean isCommonWord(String word) {
        String lowercaseWord = word.toLowerCase();
        return lowercaseWord.equals("and") ||
                lowercaseWord.equals("of") ||
                lowercaseWord.equals("the") ||
                lowercaseWord.equals("in") ||
                lowercaseWord.equals("for") ||
                lowercaseWord.equals("on") ||
                lowercaseWord.equals("by") ||
                lowercaseWord.equals("a") ||
                lowercaseWord.equals("an") ||
                lowercaseWord.equals("to");
    }

    /**
     * Generates a random color in hex format for a company.
     *
     * @param companyName The name of the company
     * @return A hex color string (e.g., "#FF5733")
     */
    @Override
    public String getCompanyColor(String companyName) {

        Random random = new Random(companyName.hashCode());

        int red = random.nextInt(256);
        int green = random.nextInt(256);
        int blue = random.nextInt(256);

        return String.format("#%02X%02X%02X", red, green, blue);
    }
}
