package org.atlas.requests;


import org.atlas.enums.SpacePrivileges;


public record SpaceMemberRequest(MemberRequest member, SpacePrivileges privileges){}