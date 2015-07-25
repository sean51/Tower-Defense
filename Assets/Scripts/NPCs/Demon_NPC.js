#pragma strict

public class Demon_NPC extends NPC
{
	function Idle_State()
	{
		if ((my_state == NPC_state.hunting || my_state == NPC_state.idle) && timer > searchCooldown)
		{
			var newTarget : GameObject = homeTower.GetComponent(Tower).findSingleEnemy();
			timer = 0.0f;
			if(newTarget != null)
			{
				target = newTarget;
				Change_State(NPC_state.moving);
			}
			else
			{
				Change_State(NPC_state.hunting);
			}
		}
	}
}