import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useTeam } from "@/hooks/use-team";

export default function TeamInvitationCard() {
  const { selectedTeam } = useTeam();

  return (
    <Card className="w-full gap-2 rounded-md shadow-none">
      <CardHeader>
        <CardTitle className="w-full font-bold text-2xl line-clamp-2">Invitation Code</CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <p className="text-sm text-muted-foreground line-clamp-3">
            Copy and share this invite code, which new members enter to join the team.
          </p>
          <div className="flex flex-row items-center gap-4 pt-6">
            <p className="text-4xl font-bold tracking-widest">{selectedTeam.code}</p>
            <Button
              variant="outline"
              onClick={() => navigator.clipboard.writeText(selectedTeam.code)}
            >
              Copy
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
