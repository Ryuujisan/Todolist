using api.Entity;
using api.Models.Items;
using api.Models.User;
using api.Models.Workspaces;
using AutoMapper;

namespace api.Data;

public class DtoMapper : Profile
{
    public DtoMapper()
    {
        CreateMap<Workspace, ProfileWorkspaceDto>();
        CreateMap<User, WorkspaceUserDto>();
        CreateMap<WorkItem, ItemViewDto>();
        
        CreateMap<User, UserDto>()
            .ForMember(dest => dest.Workspaces, opt => opt.MapFrom(src => src.Workspaces));
        
        CreateMap<Workspace, WorkspaceDto>()
            .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.Items))
            .ForMember(dest => dest.Owner, opt => opt.MapFrom(src => src.Owner));
        
        CreateMap<WorkItem, ItemDto>()
            .ForMember(dest => dest.User, opt => opt.MapFrom(src => src.User));
    }
}