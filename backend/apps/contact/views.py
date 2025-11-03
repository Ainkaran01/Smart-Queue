from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from .models import ContactSubmission
from .serializers import ContactSubmissionSerializer
from rest_framework.permissions import IsAdminUser

@api_view(['POST'])
@permission_classes([AllowAny])  # Make this endpoint public
def contact_submission(request):
    serializer = ContactSubmissionSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny])  # only staff/admin can view
def list_contact_submissions(request):
    submissions = ContactSubmission.objects.all().order_by('-submitted_at')
    serializer = ContactSubmissionSerializer(submissions, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)



@api_view(['PATCH'])
@permission_classes([AllowAny])  # Only admin/staff can update
def toggle_resolution(request, message_id):
    try:
        message = ContactSubmission.objects.get(id=message_id)
    except ContactSubmission.DoesNotExist:
        return Response({'detail': 'Message not found'}, status=status.HTTP_404_NOT_FOUND)
    
    message.is_resolved = not message.is_resolved
    message.save()
    
    serializer = ContactSubmissionSerializer(message)
    return Response(serializer.data, status=status.HTTP_200_OK)